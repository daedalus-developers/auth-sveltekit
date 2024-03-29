import { relations } from 'drizzle-orm';
import { userDetails, users } from './user.schema';

// export const usersRelation = relations(users, ({ one }) => ({
// 	details: one(userDetails)
// }));
//
// export const userDetailsRelation = relations(userDetails, ({ one }) => ({
// 	user: one(users, {
// 		fields: [userDetails.userId],
// 		references: [users.id]
// 	})
// }));
