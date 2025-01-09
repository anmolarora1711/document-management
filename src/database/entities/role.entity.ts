import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToMany,
} from 'typeorm';
import { User } from './user.entity';

@Entity('roles')
export class Role {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ unique: true })
    name: string;

    @ManyToMany(() => User, (user) => user.role)
    users: User[];
}