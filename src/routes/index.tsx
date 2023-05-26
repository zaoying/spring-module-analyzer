import { component$, useSignal, $, createContextId, Signal, useContextProvider, useContext } from '@builder.io/qwik';
import { DocumentHead, useNavigate } from '@builder.io/qwik-city';
import { SpringLogo } from '~/components/icons/spring';
import readFile from '~/components/spring/bean';
import { FileContent } from '~/root';

export default component$(() => {
  const activeTab = useSignal("beans")
  const file = useSignal("application/json")
  const isActive = (tab: string) => activeTab.value == tab ? 'active' : ''
  const toggle = $((tab: string) => {
    activeTab.value = tab
    file.value = tab == 'beans' ? 'application/json' : 'text/csv'
  })
  const content = useContext(FileContent)
  const nav = useNavigate()

  const callback = $((result: string) => {
    content.value = result
      nav(activeTab.value)
  })
  return (
    <div class="center">
      <div class="logo">
          <SpringLogo width='48' height='48' verticalAlign='top'/>
          <h1 class="purple title">Spring Module Analyzer</h1>
      </div>
      <div class="frame">
        <div class="radio buttons">
          <a class={`${isActive('beans')} primary button`} onClick$={() => toggle('beans')}>依赖分析</a>
          <a class={`${isActive('trace')} second button`}  onClick$={() => toggle('trace')}>聚类分析</a>
        </div>
        <div class="tabs">
          <div class={`${activeTab.value} dimmer content`}>
            <div class="file primary button" style={{marginTop: "230px"}} >
              <label for="file">打开文件</label>
              <input type="file" id='file' title="选择文件" accept={`${file.value}`}
                 onChange$={$((event: any) => {readFile(event, callback)})} />
            </div>
          </div>
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
