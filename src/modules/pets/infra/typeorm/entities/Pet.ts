import { Exclude } from 'class-transformer';
import User from 'src/modules/user/infra/typeorm/entities/User';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import Breed from './Breed';

@Entity('pet')
class Pet {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  age: number;

  @Column()
  breed_id: string;

  @Column()
  user_id: string;

  @Exclude()
  @CreateDateColumn({ type: 'timestamp' })
  created_at: Date;

  @Exclude()
  @UpdateDateColumn({ type: 'timestamp' })
  updated_at: Date;

  @JoinColumn({ name: 'breed_id' })
  @OneToMany(() => Breed, (breed) => breed.id)
  breed: Breed;

  @JoinColumn({ name: 'user_id' })
  @OneToMany(() => User, (user) => user.id)
  user: User;
}

export default Pet;
