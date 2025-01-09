import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    BeforeInsert,
} from 'typeorm';
import * as bcrypt from 'bcrypt';

@Entity('users')
export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ unique: true })
    username: string;

    @Column()
    password: string;

    @Column()
    role: string;

    @BeforeInsert()
    async hashPassword() {
        this.password = await bcrypt.hash(this.password, 10);
    }
}