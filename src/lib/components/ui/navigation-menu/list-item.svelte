<script lang="ts">
  export let title: string;
  export let href: string;
  export let content: string;
  export let className = "";
  import * as NavigationMenu from '../navigation-menu/index.js';
</script>

<li>
  <NavigationMenu.Link href={href} class={`hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors ${className}`}>
    <div class="text-sm font-medium leading-none">{title}</div>
    {#if content}
      <p class="text-muted-foreground line-clamp-2 text-sm leading-snug">{content}</p>
    {/if}
  </NavigationMenu.Link>
</li>
