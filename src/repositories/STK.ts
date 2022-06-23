import log from '../utils/logger';
import { Mpesa } from 'mpesa-api';
import { StkRequest } from '../entities/models/StkRequest';
import { response } from 'express';

const credentials = {
    clientKey         : process.env.MPESA_KEY, // YOUR_CONSUMER_KEY_HERE'
    clientSecret      : process.env.MPESA_SECRET, //'YOUR_CONSUMER_SECRET_HERE'
    initiatorPassword : 'YOUR_INITIATOR_PASSWORD_HERE',
    securityCredential: 'YOUR_SECURITY_CREDENTIAL',
    certificatePath   : null
};

const mpesa = new Mpesa(credentials, 'sandbox');

export class STK {
    static push = async ({phone, amount, reference, relation_id, description}) => {
        const response = await mpesa.lipaNaMpesaOnline({
            BusinessShortCode: 174379,
            Amount           : 1 /* 1000 is an example amount */,
            PartyA           : phone,
            PartyB           : "174379",
            PhoneNumber      : phone,
            CallBackURL      : 'https://d952-102-140-253-199.ngrok.io/ntsa-drivers-e8a6a/us-central1/api/mpesa/stk-callback',
            AccountReference : "Account Reference",
            passKey          : "bfb279f9aa9bdbcf158e97dd71a467cd2e0c893059b10f78e6b72ada1ed2c919",
            TransactionType  : "CustomerPayBillOnline",
            TransactionDesc  : description /* OPTIONAL */,
        });

        if (response.ResponseCode === "0") {
            return await StkRequest.save({
                phone,
                amount,
                reference,
                description,
                checkout_request_id: response.CheckoutRequestID,
                merchant_request_id: response.MerchantRequestID,
                relation_id,
            });
        }

        throw new Error(response.ResponseDescription);
    };

    static status = async (checkoutRequestId: string) => {
        try {
            const response = await mpesa.lipaNaMpesaQuery({
                BusinessShortCode: 174379,
                passKey          : "bfb279f9aa9bdbcf158e97dd71a467cd2e0c893059b10f78e6b72ada1ed2c919",
                CheckoutRequestID: checkoutRequestId
            });

            console.log('Query Status:', response);

            return response;
        } catch (err) {
            console.log('MpesaError: ', err);

            log.error(err.data.errorCode ? err.data : err.message);

            throw new Error(err.message);
        }
    };
}
