import"./animations-BWX3bC_M.js";import{c as S,g as x}from"./web3Service-BnnceUp4.js";const T="modulepreload",k=function(e){return"/"+e},C={},L=function(n,s,t){let c=Promise.resolve();if(s&&s.length>0){document.getElementsByTagName("link");const r=document.querySelector("meta[property=csp-nonce]"),l=(r==null?void 0:r.nonce)||(r==null?void 0:r.getAttribute("nonce"));c=Promise.allSettled(s.map(i=>{if(i=k(i),i in C)return;C[i]=!0;const m=i.endsWith(".css"),y=m?'[rel="stylesheet"]':"";if(document.querySelector(`link[href="${i}"]${y}`))return;const d=document.createElement("link");if(d.rel=m?"stylesheet":T,m||(d.as="script"),d.crossOrigin="",d.href=i,l&&d.setAttribute("nonce",l),document.head.appendChild(d),m)return new Promise((v,E)=>{d.addEventListener("load",v),d.addEventListener("error",()=>E(new Error(`Unable to preload CSS for ${i}`)))})}))}function o(r){const l=new Event("vite:preloadError",{cancelable:!0});if(l.payload=r,window.dispatchEvent(l),!l.defaultPrevented)throw r}return c.then(r=>{for(const l of r||[])l.status==="rejected"&&o(l.reason);return n().catch(o)})},b=localStorage.getItem("token"),$=localStorage.getItem("user");let a=null,h=[],f=[],g=null;(!b||!$)&&(alert("Unauthorized. Please login."),window.location.href="login.html");let u;var I;try{u=JSON.parse($),u.role!=="admin"&&(alert("Unauthorized: You must be an admin."),window.location.href="index.html"),document.getElementById("user-name").innerText=u.name||u.email.split("@")[0],document.getElementById("user-role").innerText="ID: "+(u.badgeId||((I=u._id)==null?void 0:I.slice(-6).toUpperCase())||"N/A")}catch(e){console.error(e)}document.getElementById("logout-action").addEventListener("click",()=>{localStorage.clear(),window.location.href="index.html"});document.getElementById("connect-wallet-btn").addEventListener("click",async()=>{try{g=await S();const e=document.getElementById("connect-wallet-btn");e.innerText="Wallet Connected",e.style.borderColor="#10b981",e.style.color="#10b981";const n=document.getElementById("wallet-address");n.style.display="block",n.innerText=`${g.substring(0,6)}...${g.substring(38)}`}catch(e){console.error("Wallet connection rejected:",e),alert(e.message||"Failed to connect wallet.")}});async function B(){try{const e=await fetch("http://localhost:5000/api/cases",{headers:{Authorization:`Bearer ${b}`}}),n=await e.json();if(!e.ok)throw new Error(n.message||"Failed to fetch cases");const s=Array.isArray(n)?n:n.data||[],c=await(await fetch("http://localhost:5000/api/evidence/pending",{headers:{Authorization:`Bearer ${b}`}})).json(),o=Array.isArray(c)?c:c.data||[];h=s.map(r=>{const l=o.filter(i=>i.caseId===r._id||i.caseId&&i.caseId._id===r._id);return{...r,evidence:l,totalEvidence:l.length}}).filter(r=>r.evidence.length>0),f=[...h],p()}catch(e){console.error(e),document.getElementById("case-list-container").innerHTML='<p style="color:red; text-align:center;">Error loading cases.</p>'}}function p(){const e=document.getElementById("case-list-container");if(document.getElementById("pending-count").innerText=`${f.reduce((n,s)=>n+s.evidence.length,0)} Items`,f.length===0){e.innerHTML='<p style="color: #666; text-align: center; margin-top: 20px;">No pending cases found.</p>';return}e.innerHTML=f.map(n=>`
                <div class="case-item ${a&&a._id===n._id?"active":""}" data-id="${n._id}">
                    <div class="case-item-icon">🗃️</div>
                    <div style="flex-grow: 1;">
                        <div class="case-item-title">${n.title}</div>
                        <div class="case-item-meta">Contains ${n.evidence.length} forensic item(s)</div>
                    </div>
                </div>
            `).join(""),document.querySelectorAll(".case-item").forEach(n=>{n.addEventListener("click",()=>{const s=n.getAttribute("data-id"),t=h.find(c=>c._id===s);t&&(a=t,p(),w())})})}document.getElementById("case-search").addEventListener("input",e=>{const n=e.target.value.toLowerCase();f=h.filter(s=>s.title.toLowerCase().includes(n)),p()});function w(){var s;const e=document.getElementById("main-content-container");if(!a||a.evidence.length===0){a=null,p(),e.innerHTML=`
                    <div class="panel-header">
                        <h2>Admin Oversight</h2>
                        <p>Select a case from the right dashboard to review forensic analysis and finalize evidence.</p>
                    </div>
                    <div style="display:flex; justify-content:center; align-items:center; height: 300px; color: #666; flex-direction: column; text-align:center;">
                        <span style="font-size: 3rem; margin-bottom: 15px; opacity: 0.5;">🗂️</span>
                        <p>No Case Selected<br>Awaiting your review.</p>
                    </div>
                `;return}let n=`
                <div class="panel-header" style="display: flex; justify-content: space-between; align-items: flex-start;">
                    <div>
                        <p style="color: var(--primary-color); font-weight: bold; font-size: 0.8rem; letter-spacing: 1px; margin-bottom: 5px;">CASE ANALYSIS</p>
                        <h2 style="font-size: 2.5rem; margin-bottom: 5px;">${a.title}</h2>
                        <p style="color: #888;">Assigned Officer ID: ${((s=a.officerId)==null?void 0:s.badgeId)||"N/A"}</p>
                    </div>
                    <button id="btn-close-case" style="background: none; border: none; font-size: 2rem; color: #666; cursor: pointer;">&times;</button>
                </div>
            `;a.evidence.forEach(t=>{var l,i;let c=((l=t.aiAnalysis)==null?void 0:l.confidence)||"N/A",o=parseInt(c)||0;const r=((i=t.aiAnalysis)==null?void 0:i.report)||"No detailed forensic analysis is available for this item.";n+=`
                <div class="dash-form" id="ev-card-${t._id}">
                    <div class="top-section">
                        <div class="evidence-visual">
                            <div class="shield-icon">🛡️</div>
                            <a href="${t.fileUrl||"#"}" target="_blank" class="view-link">👁️ View Evidence</a>
                        </div>
                        <div style="flex-grow: 1;">
                            <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
                                <span style="font-size: 0.85rem; color: #aaa; font-weight: bold;">AI CONFIDENCE <span style="color: #10b981; margin-left: 5px;">${c}</span></span>
                            </div>
                            <div style="height: 6px; background: #222; border-radius: 3px; overflow: hidden; width: 100%;">
                                <div style="height: 100%; width: ${o}%; background: #3b82f6;"></div>
                            </div>
                        </div>
                    </div>

                    <div class="report-content">${r}</div>

                    <!-- Parellel Action Buttons -->
                    <div class="action-buttons">
                        <button class="btn-action btn-approve" data-id="${t._id}">✓ Approve</button>
                        <button class="btn-action btn-reject" data-id="${t._id}">✕ Reject</button>
                    </div>
                </div>
                `}),e.innerHTML=n,document.getElementById("btn-close-case").addEventListener("click",()=>{a=null,p(),w()}),e.querySelectorAll(".btn-approve").forEach(t=>{t.addEventListener("click",()=>_(t.getAttribute("data-id"),"Verified"))}),e.querySelectorAll(".btn-reject").forEach(t=>{t.addEventListener("click",()=>_(t.getAttribute("data-id"),"Rejected"))})}async function _(e,n){var s;if(n==="Verified"&&!g){alert("Please connect your MetaMask wallet in the right dashboard to approve evidence on-chain.");return}try{const t=document.querySelector(`.btn-approve[data-id="${e}"]`),c=document.querySelector(`.btn-reject[data-id="${e}"]`);t&&(t.disabled=!0,t.innerText="Encrypting File..."),c&&(c.disabled=!0,c.innerText="Processing...");const o=a.evidence.find(i=>i._id===e),r=(o==null?void 0:o.fileHash)||"0x0000000000000000000000000000000000000000000000000000000000000000";if(n==="Verified"){const{encryptAndUploadToPinata:i}=await L(async()=>{const{encryptAndUploadToPinata:A}=await import("./pinataService-B5-woQL_.js");return{encryptAndUploadToPinata:A}},[]);t&&(t.innerText="Pushing to Pinata IPFS...");const y=(await i((o==null?void 0:o.fileUrl)||"",(o==null?void 0:o.title)||"evidence_file")).ipfsCID;t&&(t.innerText="Confirm Wallet Tx...");let d;try{d=x()}catch{try{t&&(t.innerText="Connecting Wallet..."),await S(),d=x()}catch{throw new Error("Wallet connection required to perform On-Chain save.")}}if(!d)throw new Error("Contract connection failed");let v=0;(s=o==null?void 0:o.aiAnalysis)!=null&&s.confidence&&(v=parseInt(o.aiAnalysis.confidence)||0),console.log("On-Chain Verification:",a._id,e,r,y,v);const E=await d.registerEvidence(a._id,e,r,y,v);t&&(t.innerText="Writing to Chain..."),await E.wait(),alert("File securely encrypted with Pinata and saved On-Chain!")}if(!(await fetch(`http://localhost:5000/api/evidence/verify/${e}`,{method:"PATCH",headers:{"Content-Type":"application/json",Authorization:`Bearer ${b}`},body:JSON.stringify({status:n})})).ok)throw new Error("Failed DB update");alert(`Evidence marked as ${n}.`),a.evidence=a.evidence.filter(i=>i._id!==e),a.evidence.length===0&&(h=h.filter(i=>i._id!==a._id),f=f.filter(i=>i._id!==a._id),a=null),p(),w()}catch(t){console.error("Verification error:",t),alert("An error occurred. Check console for details."),w()}}B();
