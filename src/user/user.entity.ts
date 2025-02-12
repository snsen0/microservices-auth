import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
// TypeORM için Kullanıcı modelini içerir
@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  email: string;

  @Column()
  name: string;

  @Column()
  phone: string;

  @Column()
  password: string;

  @Column({ default: true })
  isActive: boolean;
}
