import axios from "axios";
import crypto from "crypto";
import { NextFunction, Request, Response } from "express";
import paymentModel from "../../../models/payment.model";
import userModel from "../../../models/user.model";
import CustomException from "../../../utils/handlers/error.handler";
import CustomResponse from "../../../utils/handlers/response.handler";

/**
 * @route POST /api/payment/initiate
 * @desc Initiate subscription payment
 * @access Public
 * @param req
 * @param res
 * @param next
 */
export const initiatePayment = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const amount = process.env.SUBSCRIPTION_AMOUNT;

    const txnRef = `TXN_${Date.now()}_${crypto.randomBytes(4).toString("hex")}`;

    await paymentModel.create({
      user: req.user.id,
      txnRef,
      amount,
    });

    return new CustomResponse(res).success(
      "Successful payment initiation!",
      {
        txn_ref: txnRef,
        amount,
        currency: 566,
        site_redirect_url: `${process.env.FRONTEND_URL}/payment/callback`,
      },
      200
    );
  } catch (error) {
    console.error(error);
    return next(error);
  }
};

/**
 * @route POST /api/payment/verify
 * @desc Verify that user's subscription payment is successful
 * @access Public
 * @param req
 * @param res
 * @param next
 */
export const verifyPayment = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { txnRef } = req.body;

    const payment = await paymentModel.findOne({ txnRef });

    if (!payment) {
      return next(
        new CustomException(404, "Payment not found", {
          success: false,
          path: "/payment/verify",
        })
      );
    }

    const url = `${process.env.INTERSWITCH_BASE_URL}?merchantcode=${process.env.INTERSWITCH_MERCHANT_CODE}&transactionreference=${txnRef}&amount=${payment.amount}`;

    const response = await axios.get(url);

    const data = response.data;

    if (data.ResponseCode === "00" && Number(data.Amount) === payment.amount) {
      payment.status = "success";
      payment.paidAt = new Date();
      await payment.save();

      const expiresAt = new Date();
      expiresAt.setDate(expiresAt.getDate() + 30);

      await userModel.findByIdAndUpdate(payment.user, {
        premiumExpiresAt: expiresAt,
      });

      return new CustomResponse(res).success(
        "Payment verified and user subscribed!",
        {},
        200
      );
    }

    payment.status = "failed";
    await payment.save();

    return next(
      new CustomException(500, "Payment could not be verified.", {
        success: false,
        path: "/payment/verify",
      })
    );
  } catch (error) {
    console.error(error);
    return next(error);
  }
};
