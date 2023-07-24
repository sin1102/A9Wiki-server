import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { OperatorsModule } from './modules/operators/operators.module';
import { TagsModule } from './modules/tags/tags.module';
import { ClassesModule } from './modules/classes/classes.module';
import { TierModule } from './modules/tier/tier.module';
@Module({
  imports: [
    OperatorsModule,
    TagsModule,
    ClassesModule,
    TierModule,
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env.dev',
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get<string>('MONGOCON'),
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
