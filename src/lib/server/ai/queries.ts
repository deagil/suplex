import type { DbError } from '$lib/errors/db';
import { DbInternalError } from '$lib/errors/db';
import ms from 'ms';

export async function getAuthUser(email: string): Promise<AuthUser> {
	try {
		const userResult = await db.select().from(user).where(eq(user.email, email));
		return unwrapSingleQueryResult(userResult, email, 'User');
	} catch (e) {
		throw new DbInternalError({ cause: e });
	}
}

export async function getUser(email: string): Promise<User> {
	try {
		const userResult = await db.select().from(user).where(eq(user.email, email));
		const { password: _, ...rest } = await unwrapSingleQueryResult(userResult, email, 'User');
		return rest;
	} catch (e) {
		throw new DbInternalError({ cause: e });
	}
}

export async function createAuthUser(email: string, password: string): Promise<AuthUser> {
	try {
		const salt = genSaltSync(10);
		const hash = hashSync(password, salt);
		const userResult = await db.insert(user).values({ email, password: hash }).returning();
		return unwrapSingleQueryResult(userResult, email, 'User');
	} catch (e) {
		console.error(e);
		throw new DbInternalError({ cause: e });
	}
}

export async function createSession(value: Session): Promise<Session> {
	try {
		const sessionResult = await db.insert(session).values(value).returning();
		return unwrapSingleQueryResult(sessionResult, value.id, 'Session');
	} catch (e) {
		throw new DbInternalError({ cause: e });
	}
}

export async function getFullSession(sessionId: string): Promise<{ session: Session; user: User }> {
	try {
		const sessionResult = await db
			.select({ user: { id: user.id, email: user.email }, session })
			.from(session)
			.innerJoin(user, eq(session.userId, user.id))
			.where(eq(session.id, sessionId));
		return unwrapSingleQueryResult(sessionResult, sessionId, 'Session');
	} catch (e) {
		throw new DbInternalError({ cause: e });
	}
}

export async function deleteSession(sessionId: string): Promise<void> {
	try {
		await db.delete(session).where(eq(session.id, sessionId));
	} catch (e) {
		throw new DbInternalError({ cause: e });
	}
}

export async function extendSession(sessionId: string): Promise<Session> {
	try {
		const sessionResult = await db
			.update(session)
			.set({ expiresAt: new Date(Date.now() + ms('30d')) })
			.where(eq(session.id, sessionId))
			.returning();
		return unwrapSingleQueryResult(sessionResult, sessionId, 'Session');
	} catch (e) {
		throw new DbInternalError({ cause: e });
	}
}

export async function deleteSessionsForUser(userId: string): Promise<void> {
	try {
		await db.delete(session).where(eq(session.userId, userId));
	} catch (e) {
		throw new DbInternalError({ cause: e });
	}
}

export async function saveChat({ id, userId, title }: { id: string; userId: string; title: string; }): Promise<Chat> {
	try {
		const insertResult = await db
			.insert(chat)
			.values({
				id,
				createdAt: new Date(),
				userId,
				title
			})
			.returning();
		return unwrapSingleQueryResult(insertResult, id, 'Chat');
	} catch (e) {
		throw new DbInternalError({ cause: e });
	}
}

export async function deleteChatById({ id }: { id: string }): Promise<void> {
	try {
		const actions = [
			() => db.delete(vote).where(eq(vote.chatId, id)),
			() => db.delete(message).where(eq(message.chatId, id)),
			() => db.delete(chat).where(eq(chat.id, id))
		];
		for (const action of actions) {
			await action();
		}
	} catch (e) {
		throw new DbInternalError({ cause: e });
	}
}

export async function getChatsByUserId({ id }: { id: string }): Promise<Chat[]> {
	try {
		return await db.select().from(chat).where(eq(chat.userId, id)).orderBy(desc(chat.createdAt));
	} catch (e) {
		throw new DbInternalError({ cause: e });
	}
}

export async function getChatById({ id }: { id: string }): Promise<Chat> {
	try {
		const chatResult = await db.select().from(chat).where(eq(chat.id, id));
		return unwrapSingleQueryResult(chatResult, id, 'Chat');
	} catch (e) {
		throw new DbInternalError({ cause: e });
	}
}

export async function saveMessages({ messages }: { messages: Array<Message>; }): Promise<Message[]> {
	try {
		return await db.insert(message).values(messages).returning();
	} catch (e) {
		throw new DbInternalError({ cause: e });
	}
}

export async function getMessagesByChatId({ id }: { id: string }): Promise<Message[]> {
	try {
		return await db.select().from(message).where(eq(message.chatId, id)).orderBy(asc(message.createdAt));
	} catch (e) {
		throw new DbInternalError({ cause: e });
	}
}

export async function voteMessage({ chatId, messageId, type }: { chatId: string; messageId: string; type: 'up' | 'down'; }): Promise<void> {
	try {
		await db
			.insert(vote)
			.values({
				chatId,
				messageId,
				isUpvoted: type === 'up'
			})
			.onConflictDoUpdate({
				target: [vote.messageId, vote.chatId],
				set: { isUpvoted: type === 'up' }
			});
	} catch (e) {
		throw new DbInternalError({ cause: e });
	}
}

export async function getVotesByChatId({ id }: { id: string }): Promise<Vote[]> {
	try {
		return await db.select().from(vote).where(eq(vote.chatId, id));
	} catch (e) {
		throw new DbInternalError({ cause: e });
	}
}

export async function saveDocument({ id, title, kind, content, userId }: { id: string; title: string; kind: never; content: string; userId: string; }) {
	try {
		return await db.insert(document).values({
			id,
			title,
			kind,
			content,
			userId,
			createdAt: new Date()
		});
	} catch (error) {
		console.error('Failed to save document in database');
		throw error;
	}
}

export async function getDocumentsById({ id }: { id: string }) {
	try {
		const documents = await db
			.select()
			.from(document)
			.where(eq(document.id, id))
			.orderBy(asc(document.createdAt));
		return documents;
	} catch (error) {
		console.error('Failed to get document by id from database');
		throw error;
	}
}

export async function getDocumentById({ id }: { id: string }) {
	try {
		const [selectedDocument] = await db
			.select()
			.from(document)
			.where(eq(document.id, id))
			.orderBy(desc(document.createdAt));
		return selectedDocument;
	} catch (error) {
		console.error('Failed to get document by id from database');
		throw error;
	}
}

export async function deleteDocumentsByIdAfterTimestamp({ id, timestamp }: { id: string; timestamp: Date; }) {
	try {
		await db
			.delete(suggestion)
			.where(and(eq(suggestion.documentId, id), gt(suggestion.documentCreatedAt, timestamp)));
		return await db
			.delete(document)
			.where(and(eq(document.id, id), gt(document.createdAt, timestamp)));
	} catch (error) {
		console.error('Failed to delete documents by id after timestamp from database');
		throw error;
	}
}

export async function saveSuggestions({ suggestions }: { suggestions: Array<Suggestion>; }): Promise<Suggestion[]> {
	try {
		return await db.insert(suggestion).values(suggestions).returning();
	} catch (e) {
		throw new DbInternalError({ cause: e });
	}
}

export async function getSuggestionsByDocumentId({ documentId }: { documentId: string; }): Promise<Suggestion[]> {
	try {
		return await db.select().from(suggestion).where(eq(suggestion.documentId, documentId));
	} catch (e) {
		throw new DbInternalError({ cause: e });
	}
}

export async function getMessageById({ id }: { id: string }): Promise<Message> {
	try {
		const messageResult = await db.select().from(message).where(eq(message.id, id));
		return unwrapSingleQueryResult(messageResult, id, 'Message');
	} catch (e) {
		throw new DbInternalError({ cause: e });
	}
}

export async function deleteMessagesByChatIdAfterTimestamp({ chatId, timestamp }: { chatId: string; timestamp: Date; }): Promise<void> {
	try {
		const messagesToDelete = await db
			.select({ id: message.id })
			.from(message)
			.where(and(eq(message.chatId, chatId), gte(message.createdAt, timestamp)));
		const messageIds = messagesToDelete.map((message) => message.id);
		if (messageIds.length > 0) {
			await db.delete(vote).where(and(eq(vote.chatId, chatId), inArray(vote.messageId, messageIds)));
			await db.delete(message).where(and(eq(message.chatId, chatId), inArray(message.id, messageIds)));
		}
	} catch (e) {
		throw new DbInternalError({ cause: e });
	}
}

export async function deleteTrailingMessages({ id }: { id: string }): Promise<void> {
	try {
		const message = await getMessageById({ id });
		await deleteMessagesByChatIdAfterTimestamp({
			chatId: message.chatId,
			timestamp: message.createdAt
		});
	} catch (e) {
		throw new DbInternalError({ cause: e });
	}
}

export async function updateChatVisiblityById({ chatId, visibility }: { chatId: string; visibility: 'private' | 'public'; }): Promise<void> {
	try {
		await db.update(chat).set({ visibility }).where(eq(chat.id, chatId));
	} catch (e) {
		throw new DbInternalError({ cause: e });
	}
}
