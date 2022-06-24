import { Column, Entity, JoinColumn, OneToOne } from "typeorm";
import { BaseEntity } from './BaseEntity';
import { StkRequest } from './StkRequest';

@Entity('callbacks')
export class StkCallback extends BaseEntity {
    @Column({unique: true})
    checkout_request_id: string;

    @Column({unique: true})
    merchant_request_id: string;

    @Column({type: 'integer'})
    result_code: number;

    @Column()
    result_desc: string;

    @Column({type: 'integer', default: 0})
    amount: number;

    @OneToOne(() => StkRequest, request => request.callback) // specify inverse side as a second parameter
    @JoinColumn({referencedColumnName: 'checkout_request_id'})
    request: StkRequest;
}
