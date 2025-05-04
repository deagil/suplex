import type { VisibilityType } from '$lib/components/copilot/visibility-selector.svelte';
import { getContext, setContext } from 'svelte';
import { toast } from 'svelte-sonner';

const contextKey = Symbol('ChatHistory');

export class ChatHistory {
	#loading = $state(false);
	#revalidating = $state(false);
	chats = $state<Chat[]>([]);

	get loading() {
		console.log('[ChatHistory] get loading:', this.#loading);
		return this.#loading;
	}

	get revalidating() {
		console.log('[ChatHistory] get revalidating:', this.#revalidating);
		return this.#revalidating;
	}

	constructor(chatsPromise: Promise<Chat[]>) {
		console.log('[ChatHistory] constructor called');
		this.#loading = true;
		this.#revalidating = true;
		chatsPromise
			.then((chats) => {
				console.log('[ChatHistory] constructor resolved chats:', chats);
				this.chats = chats;
			})
			.finally(() => {
				console.log('[ChatHistory] constructor finished loading');
				this.#loading = false;
				this.#revalidating = false;
			});
	}

	getChatDetails = (chatId: string) => {
		const found = this.chats.find((c) => c.id === chatId);
		console.log('[ChatHistory] getChatDetails for', chatId, 'found:', found);
		return found;
	};

	updateVisibility = async (chatId: string, visibility: VisibilityType) => {
		console.log('[ChatHistory] updateVisibility called', { chatId, visibility });
		const chat = this.chats.find((c) => c.id === chatId);
		if (chat) {
			chat.visibility = visibility;
		}
		const res = await fetch('/api/chat/visibility', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({ chatId, visibility })
		});
		console.log('[ChatHistory] updateVisibility response', res);
		if (!res.ok) {
			toast.error('Failed to update chat visibility');
			// try reloading data from source in case another competing mutation caused an issue
			await this.refetch();
		}
	};

	setContext() {
		console.log('[ChatHistory] setContext called');
		setContext(contextKey, this);
	}

	async refetch() {
		console.log('[ChatHistory] refetch called');
		this.#revalidating = true;
		try {
			const res = await fetch('/api/history');
			console.log('[ChatHistory] refetch /api/history response', res);
			if (res.ok) {
				const chats = await res.json();
				console.log('[ChatHistory] refetch loaded chats:', chats);
				this.chats = chats;
			} else {
				console.error('[ChatHistory] refetch failed', res.status, res.statusText);
			}
		} catch (err) {
			console.error('[ChatHistory] refetch error', err);
		} finally {
			this.#revalidating = false;
		}
	}

	static fromContext(): ChatHistory {
		const ctx = getContext(contextKey);
		console.log('[ChatHistory] fromContext called, got:', ctx);
		return ctx;
	}
}
