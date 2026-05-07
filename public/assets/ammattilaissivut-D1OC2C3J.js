import"./style-DDgsSj9f.js";import"./main-B7IVzkVs.js";import{t as e}from"./fetch-Dt1wVZxm.js";import"./loggedUser-CNi0HL4K.js";import"./navbar-dyxaQTBq.js";var t=()=>{let e=Number(localStorage.getItem(`role_id`)),t=document.querySelector(`.laakarincontent`),n=document.querySelector(`.yllapitajancontent`);!t||!n||(t.classList.add(`hidden`),n.classList.add(`hidden`),e===2?t.classList.remove(`hidden`):e===1?n.classList.remove(`hidden`):console.warn(`Tuntematon role_id:`,e))},n=()=>{let e=document.getElementById(`show-register-form`),t=document.getElementById(`register-form-container`);!e||!t||e.addEventListener(`click`,()=>{t.classList.toggle(`hidden`)})},r=()=>{let t=document.getElementById(`register-form`);t&&t.addEventListener(`submit`,async n=>{n.preventDefault();let r=localStorage.getItem(`token`),i={email:document.getElementById(`email`).value,name:document.getElementById(`name`).value,password:document.getElementById(`password`).value,role_id:Number(document.getElementById(`role`).value),auth_provider:`local`},a=await e(`http://localhost:3000/api/users`,{method:`POST`,headers:{Authorization:`Bearer ${r}`,"Content-Type":`application/json`},body:JSON.stringify(i)});if(!a||a.error){alert(`Käyttäjän luonti epäonnistui`);return}alert(`Käyttäjä luotu`),t.reset()})};document.addEventListener(`DOMContentLoaded`,()=>{t(),n(),r()});var i=document.querySelector(`#taulukko`),a=document.querySelector(`.get_users`),o=localStorage.getItem(`user_id`);o||console.error(`user_id puuttuu localStoragesta`);var s=e=>{if(i.innerHTML=``,!e||e.length===0){let e=document.createElement(`tr`);e.innerHTML=`<td colspan="4">Ei potilaita</td>`,i.appendChild(e);return}e.forEach(e=>{let t=document.createElement(`tr`);t.innerHTML=`
  <td>${e.name}</td>

  <td>
    <button class="info-btn" data-id="${e.user_id}">
      Avaa tiedot
    </button>
  </td>
`,i.appendChild(t)}),p()},c=async()=>{if(o)try{let t=await e(`http://localhost:3000/api/users/patients/${o}`,{method:`GET`,headers:{"Content-Type":`application/json`,Authorization:`Bearer ${localStorage.getItem(`token`)}`}}),n=t?.users||t?.data||t;if(!Array.isArray(n)){console.error(`API ei palauttanut taulukkoa:`,t);return}s(n),console.log(n)}catch(e){console.error(`Virhe haettaessa potilaita:`,e)}},l=async t=>{let n=localStorage.getItem(`token`);return await e(`http://localhost:3000/api/users/${t}`,{headers:{Authorization:`Bearer ${n}`}})},u=async t=>{let n=localStorage.getItem(`token`);return await e(`http://localhost:3000/api/tsq/user/${t}`,{headers:{Authorization:`Bearer ${n}`}})},d=async t=>{let n=localStorage.getItem(`token`);return await e(`http://localhost:3000/api/tsq/${t}`,{headers:{Authorization:`Bearer ${n}`}})},f=(e,t,n,r)=>{let i=document.querySelector(`.diary_dialog`),a=i.querySelector(`.patient-info`),o=i.querySelector(`.tsq-info`);console.log(`TSQ DATA:`,t),a.innerHTML=`
    <p><strong>Nimi:</strong> ${e.name}</p>
    <p><strong>Sähköposti:</strong> ${e.email}</p>
  `;let s=Array.isArray(t)?t:t?[t]:[];s.length===0?o.innerHTML=`<p>Ei TSQ dataa</p>`:o.innerHTML=s.map((e,t)=>`

    <div class="tsq-entry">

      <p>
        <strong>Traumaseulontakyselyn pisteet:</strong>
        ${e.points}
      </p>

      <p>
        <strong>Vastattu:</strong>
        <small>
          ${new Date(e.created_at).toLocaleDateString(`fi-FI`)}
        </small>
      </p>

      <button
        class="toggle-tsq-btn"
        data-id="${e.id}"
        data-index="${t}"
      >
        Näytä TSQ-vastaukset
      </button>

      <div class="tsq-answers hidden"></div>

      <hr>

    </div>

  `).join(``);let c=!n||n.length===0?`<p>Ei päiväkirjamerkintöjä</p>`:n.map((e,t)=>`
          <div class="entry-card" data-index="${t}">

            <p>
              <strong>Päivämäärä:</strong> ${new Date(e.created_at||e.entry_date).toLocaleDateString(`fi-FI`)}
            </p>

            <button class="toggle-entry-btn" data-index="${t}">
              Näytä vastaukset
            </button>

            <div class="entry-details hidden">
              <p><strong>Paino:</strong> ${e.weight??`-`}</p>
              <p><strong>Uni:</strong> ${e.sleep??`-`}</p>
              <p><strong>Energia:</strong> ${e.energy??`-`}</p>
              <p><strong>Stressi:</strong> ${e.stress??`-`}</p>
              <p><strong>Mieliala:</strong> ${e.mood??`-`}</p>
              <p><strong>Oireet:</strong> ${e.symptoms??`-`}</p>
              <p><strong>Lääkitys:</strong> ${e.medication??`-`}</p>
              <p><strong>Muistiinpanot:</strong> ${e.notes??`-`}</p>
            </div>

            <hr>
          </div>
        `).join(``);o.innerHTML+=`
  <hr>
  <h3>Päiväkirjamerkinnät</h3>
  ${c}
`,o.addEventListener(`click`,async e=>{let t=e.target.closest(`.toggle-entry-btn`),n=e.target.closest(`.toggle-tsq-btn`);if(n){let e=n.parentElement.querySelector(`.tsq-answers`);if(!e.classList.contains(`hidden`)){e.classList.add(`hidden`),n.textContent=`Näytä TSQ-vastaukset`;return}let t=n.dataset.id;e.innerHTML=`<p>Ladataan vastauksia...</p>`,e.classList.remove(`hidden`);try{let r=await d(t);r?e.innerHTML=`

  <p class="tsq-intro">
    Merkitse kyllä tai ei sen mukaan, oletko kokenut seuraavia
    vähintään kahdesti viimeisen viikon aikana.
  </p>

  <div class="tsq-question">
    <p>
      1. Järkyttäviä ajatuksia tai muistoja tapahtumasta,
      jotka ovat tulleet mieleesi oman tahtosi vastaisesti.
    </p>
    <strong>${r.q1?`Kyllä`:`Ei`}</strong>
  </div>

  <div class="tsq-question">
    <p>2. Järkyttäviä unia tapahtumasta.</p>
    <strong>${r.q2?`Kyllä`:`Ei`}</strong>
  </div>

  <div class="tsq-question">
    <p>
      3. Toimimista tai tunnetta ikään kuin traumaattinen
      kokemus tapahtuisi uudelleen.
    </p>
    <strong>${r.q3?`Kyllä`:`Ei`}</strong>
  </div>

  <div class="tsq-question">
    <p>
      4. Tapahtumasta muistuttavien tekijöiden aiheuttamaa
      järkytyksen tunnetta.
    </p>
    <strong>${r.q4?`Kyllä`:`Ei`}</strong>
  </div>

  <div class="tsq-question">
    <p>
      5. Ruumiillisia reaktioita (kuten nopea sydämen syke,
      vatsan väänteet, hikoilu, huimaus)
      jonkin muistutettaessa tapahtumasta.
    </p>
    <strong>${r.q5?`Kyllä`:`Ei`}</strong>
  </div>

  <div class="tsq-question">
    <p>
      6. Vaikeutta nukahtaa tai pysyä unessa.
    </p>
    <strong>${r.q6?`Kyllä`:`Ei`}</strong>
  </div>

  <div class="tsq-question">
    <p>
      7. Ärtyisyyttä tai vihan purkauksia.
    </p>
    <strong>${r.q7?`Kyllä`:`Ei`}</strong>
  </div>

  <div class="tsq-question">
    <p>
      8. Keskittymisvaikeuksia.
    </p>
    <strong>${r.q8?`Kyllä`:`Ei`}</strong>
  </div>

  <div class="tsq-question">
    <p>
      9. Voimistunutta tietoisuutta mahdollisista
      vaaroista itsellesi tai toisille.
    </p>
    <strong>${r.q9?`Kyllä`:`Ei`}</strong>
  </div>

  <div class="tsq-question">
    <p>
      10. Hermostuneisuutta tai säikkymistä
      jotain odottamatonta kohtaan.
    </p>
    <strong>${r.q10?`Kyllä`:`Ei`}</strong>
  </div>

`:e.innerHTML=`<p>Ei vastauksia</p>`,n.textContent=`Piilota TSQ-vastaukset`}catch(t){console.error(t),e.innerHTML=`<p>TSQ-vastausten haku epäonnistui</p>`}return}if(!t)return;let r=t.closest(`.entry-card`).querySelector(`.entry-details`),i=r.classList.contains(`hidden`);r.classList.toggle(`hidden`),t.textContent=i?`Piilota vastaukset`:`Näytä vastaukset`});let l=(Array.isArray(r)?r:r?.results||[])[0];if(l){let e=Math.round(l.readiness??0),t=Math.round(l.stress_index??0);o.innerHTML+=`
    <hr>

    <h3>HRV / Hyvinvointidata</h3>

    <p>
      <strong>Palautuminen:</strong>
      <span style="color:${e>=80?`green`:e>=60?`orange`:`red`}">
        ${e}
      </span>
    </p>

    <p>
      <span style="color:${t<=10?`green`:t<=20?`orange`:`red`}">
      ${t}
      </span>
    </p>
  `}i.showModal()},p=()=>{document.querySelectorAll(`.info-btn`).forEach(e=>{e.addEventListener(`click`,async e=>{let t=e.target.dataset.id,n=document.querySelector(`.diary_dialog`),r=n.querySelector(`.patient-info`),i=n.querySelector(`.tsq-info`);r.innerHTML=`<p>Ladataan...</p>`,i.innerHTML=``,n.showModal();try{let e=await l(t),n=await u(t),i=await b(t),a=await x(t);if(!e||e.error){r.innerHTML=`<p>Virhe potilaan haussa</p>`;return}f(e,n,i,a)}catch(e){console.error(e),r.innerHTML=`<p>Virhe haussa</p>`}})})},m=()=>{let e=document.querySelector(`.diary_dialog`),t=document.getElementById(`close-dialog`);!e||!t||t.addEventListener(`click`,()=>{e.close()})},h=async()=>await e(`http://localhost:3000/api/users/patients`,{headers:{Authorization:`Bearer ${localStorage.getItem(`token`)}`}}),g=async t=>{let n=localStorage.getItem(`token`);return await e(`http://localhost:3000/api/users/patients/${t}/doctor`,{method:`PUT`,headers:{"Content-Type":`application/json`,Authorization:`Bearer ${n}`}})},_=e=>{let t=document.querySelector(`.all-patients-dialog`),n=t.querySelector(`.all-patients-list`);if(!e||e.length===0){n.innerHTML=`<p>Ei potilaita</p>`,t.showModal();return}n.innerHTML=e.map(e=>`

    <div class="patient-card">

      <p>
        <strong>${e.name}</strong>
      </p>

      <p>${e.email}</p>

      <button
        class="add-patient-btn"
        data-id="${e.user_id}"
      >
        Lisää potilaaksi
      </button>

      <hr>

    </div>

  `).join(``),t.showModal(),n.querySelectorAll(`.add-patient-btn`).forEach(e=>{e.addEventListener(`click`,async()=>{let t=e.dataset.id;try{await g(t),e.disabled=!0,e.textContent=`Lisätty`}catch(e){console.error(e),alert(`Potilaan lisääminen epäonnistui`)}})})},v=()=>{let e=document.querySelector(`.all-patients-dialog`),t=document.querySelector(`#close-all-patients`);!e||!t||t.addEventListener(`click`,()=>{e.close()})},y=document.querySelector(`.get_all_patients`);document.addEventListener(`DOMContentLoaded`,()=>{m(),v()}),a&&a.addEventListener(`click`,c),y&&y.addEventListener(`click`,async()=>{try{let e=await h();_(e.users||e.data||e)}catch(e){console.error(e)}});var b=async t=>{let n=localStorage.getItem(`token`);return await e(`http://localhost:3000/api/entries/user/${t}`,{headers:{Authorization:`Bearer ${n}`}})},x=async t=>{let n=localStorage.getItem(`token`);return await e(`http://localhost:3000/api/kubios/user-data/${t}`,{headers:{Authorization:`Bearer ${n}`}})};