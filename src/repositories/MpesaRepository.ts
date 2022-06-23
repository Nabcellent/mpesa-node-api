import { StkRequest } from '../entities/models/StkRequest';

export class MpesaRepository {
    static queryStkStatus = () => {
        const stk = StkRequest.findBy({})
    };
}
