import { StkRequest } from '../../entities/models/StkRequest';
import { AppDataSource } from '../../entities/data-source';
import { STK } from '../../repositories/STK';
import { StkCallback } from '../../entities/models/StkCallback';

export const MpesaController = {
    initiateStk: async ({body}, res) => {
        const {phone, amount, reference, relation_id, description} = body;

        STK.push({phone, amount, reference, relation_id, description}).then(request => {
            console.log('Stk Request:', request);

            res.send(request);
        }).catch(err => {
            console.log('MpesaError: ', err);

            res.status(400).send(err.message);
        });
    },

    stkCallback: async ({body}, res) => {
        const {Body: {stkCallback}} = body;

        const callback = await StkCallback.save({
            checkout_request_id: stkCallback.CheckoutRequestID,
            merchant_request_id: stkCallback.MerchantRequestID,
            result_code        : stkCallback.ResultCode,
            result_desc        : stkCallback.ResultDesc,
        });

        console.log('Stk Callback:', callback);

        res.send({});
    },

    queryStkStatus: async (req, res) => {
        const repo = AppDataSource.getRepository(StkRequest).createQueryBuilder('requests');
        const stk = await repo.where('NOT EXISTS (SELECT * FROM callbacks c WHERE c.checkout_request_id = requests.checkout_request_id)').getMany();

        const success = [], errors = [];

        stk.map(async request => {
            try {
                const status = await STK.status(request.checkout_request_id);

                success.push({[request.checkout_request_id]: status.ResultDesc});

                await StkCallback.save({
                    checkout_request_id: status.CheckoutRequestID,
                    merchant_request_id: status.MerchantRequestID,
                    result_code        : Number(status.ResultCode),
                    result_desc        : status.ResultDesc,
                    amount             : request.amount
                });
            } catch (err) {
                errors.push({[request.checkout_request_id]: err.message});
            }
        });

        res.send({successful: success, errors});
    }
};
