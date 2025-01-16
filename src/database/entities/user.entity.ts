import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
    BeforeInsert,
    JoinColumn,
} from 'typeorm';
import * as bcrypt from 'bcrypt';
import { Role } from './role.entity';

@Entity('users')
export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ unique: true })
    username: string;

    @Column()
    password: string;

    // This is the relationship with the Role entity (Many-to-One)
    @ManyToOne(() => Role, (role) => role.users, { eager: true })  // eager: true will automatically load the role with the user
    @JoinColumn({ name: 'role_id' })  // The foreign key in the User table
    role: Role;  // A single role for each user

    @BeforeInsert()
    async hashPassword() {
        this.password = await bcrypt.hash(this.password, 10);
    }
}