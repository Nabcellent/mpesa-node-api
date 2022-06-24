import { Column, Entity, JoinColumn, OneToOne } from "typeorm";
import { BaseEntity } from './BaseEntity';
import { StkCallback } from './StkCallback';

@Entity('requests')
export class StkRequest extends BaseEntity {
    @Column({unique: true})
    checkout_request_id: string;

    @Column({unique: true})
    merchant_request_id: string;

    @Column()
    relation_id: string;

    @Column({length: 12})
    phone: string;

    @Column({type: 'integer', default: 0})
    amount: number;

    @Column()
    reference: string;

    @Column()
    description: string;

    // specify inverse side as a second parameter
    @OneToOne(() => StkCallback, callback => callback.request)
    @JoinColumn({name: 'checkout_request_id', referencedColumnName: 'checkout_request_id'})
    callback: StkCallback;
}
