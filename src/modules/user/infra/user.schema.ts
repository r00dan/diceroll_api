import { Prop, Schema, SchemaFactory, ModelDefinition } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

@Schema()
export class User {
  @Prop({ required: true })
  id: string;

  @Prop()
  full_name?: string;

  @Prop()
  username?: string;

  @Prop()
  email?: string;

  @Prop()
  google_id?: string;

  @Prop()
  is_premium?: boolean;

  @Prop()
  created_at?: Date;

  @Prop()
  avatar_url?: string;
}

export type UserDocument = HydratedDocument<User>;
export const UserSchema = SchemaFactory.createForClass(User);
export const UserModel: ModelDefinition = {
  name: User.name,
  schema: UserSchema,
};
