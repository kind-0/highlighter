update:
	pnpm add @nostr-dev-kit/ndk@latest @nostr-dev-kit/ndk-svelte-components@latest @nostr-dev-kit/ndk-svelte@latest @nostr-dev-kit/ndk-cache-dexie@latest

deploy:
	rsync -avP -l -t . --exclude node_modules pablo@highlighter.com:highlighter
	ssh pablo@highlighter.com "source ~/.nvm/nvm.sh && cd highlighter && npm install && pm2 restart highlighter"

devploy:
	pnpm build
	rsync -avP -l -t . --exclude node_modules pablo@dev.highlighter.com:projects/dev-highlighter
	ssh pablo@dev.highlighter.com "source ~/.nvm/nvm.sh && cd projects/dev-highlighter && /home/pablo/.local/share/pnpm/pnpm install && pm2 restart dev-highlighter"

