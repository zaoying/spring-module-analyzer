import { component$, useStylesScoped$ } from '@builder.io/qwik';
import styles from './header.css?inline';
import { SpringLogo } from '../icons/spring';

export default component$(() => {
  useStylesScoped$(styles);

  return (
    <header>
      <div class="logo">
        <a href="https://qwik.builder.io/" target="_blank" title="qwik">
          <SpringLogo width='36' height='36' verticalAlign='middle'/>
          <h4 style={{display: 'inline-block', margin: "0 0.5em", verticalAlign: 'middle'}}>Spring Module Analyzer</h4>
        </a>
      </div>
      <ul>
      </ul>
    </header>
  );
});
