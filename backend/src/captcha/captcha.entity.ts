import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Captcha {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  value: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP'})
  timestamp: Date;
}
