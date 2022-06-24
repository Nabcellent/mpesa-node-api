import log from '../utils/logger';
import { Mpesa } from 'mpesa-api';
import { StkRequest } from '../entities/models/StkRequest';

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
            CallBackURL      : `${process.env.APP_URL}/api/v1/mpesa/stk-callback`,
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

            if(err.data.errorCode) {
                log.error(err.data)

                if(err.data.errorCode === '500.001.1001') return err.data
            } else {
                log.error(err.message)
            }

            throw new Error(err.message);
        }
    };
}
