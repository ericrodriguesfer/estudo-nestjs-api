import { Exclude } from 'class-transformer';
import User from '../../../../../modules/user/infra/typeorm/entities/User';
import {
  Column,
  CreateDateColumn,
  Entity,
  Generated,
  JoinColumn,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('token')
class Token {
  @Exclude()
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  user_id: string;

  @Column('uuid')
  @Generated('uuid')
  token: string;

  @CreateDateColumn({ type: 'date' })
  expires: Date;

  @Column()
  used: boolean;

  @Exclude()
  @Column({ default: 'null' })
  used_in: Date;

  @Exclude()
  @CreateDateColumn({ type: 'timestamp' })
  created_at: Date;

  @Exclude()
  @UpdateDateColumn({ type: 'timestamp' })
  updated_at: Date;

  @JoinColumn({ name: 'user_id' })
  @OneToMany(() => User, (user) => user.id)
  user: User;
}

export default Token;
