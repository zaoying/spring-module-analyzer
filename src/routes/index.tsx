import { component$, useSignal, useStyles$ } from '@builder.io/qwik';
import styles from '../global.css?inline';
import type { DocumentHead } from '@builder.io/qwik-city';
import { SpringLogo } from '~/components/icons/spring';

export default component$(() => {
  useStyles$(styles)
  const activeTab = useSignal("beans")
  return (
    <div class="center">
      <div class="logo">
          <SpringLogo width='48' height='48' verticalAlign='top'/>
          <h1 class="purple title">Spring Module Analyzer</h1>
      </div>
      <div class="frame">
        <div class="buttons">
          <a class="primary button" onClick$={() => activeTab.value = 'beans'}>依赖分析</a>
          <a class="second button"  onClick$={() => activeTab.value = 'trace'}>聚类分析</a>
        </div>
        <div class="tabs">
          { activeTab.value }
          { activeTab.value == 'beans' ? <div class="tabs"></div> : ""}
          { activeTab.value == 'trace' ? <div class="tabs"></div> : ""}
        </div>
      </div>
    </div>
  );
});

export const head: DocumentHead = {
  title: 'Spring Module Analyzer',
  meta: [
    {
      name: 'description',
      content: 'Spring Module Analyzer',
    },
  ],
};
