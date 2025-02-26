import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { EntityTimestamp } from '@/common/entity-timestamp.entity';

@Entity()
export class Account extends EntityTimestamp {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  username: string;

  @Column()
  password: string;

  @Column({
    default: 'https://kr.object.ncloudstorage.com/4card-harmony-bucket/default_profile.jpg',
  })
  profileImage: string;

  @Column({ nullable: true })
  refreshToken: string;

  setRefreshToken(refreshToken: string | null) {
    this.refreshToken = refreshToken;
  }
}
