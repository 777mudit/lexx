import"./animations-BWX3bC_M.js";import{c as x,g as y,a as C}from"./web3Service-BnnceUp4.js";const g=localStorage.getItem("token"),b=localStorage.getItem("user");let n=null,l=[],r=[],c=null,f=!1;(!g||!b)&&(window.location.href="login.html");let o;var v;try{o=JSON.parse(b),o.role!=="judge"&&(alert("Unauthorized: You must be a judge."),window.location.href="index.html"),document.getElementById("user-name").innerText=`Hon. ${o.name||o.email.split("@")[0]}`,document.getElementById("user-role").innerText="ID: "+(o.badgeId||((v=o._id)==null?void 0:v.slice(-6).toUpperCase())||"N/A")}catch(t){console.error(t)}document.getElementById("logout-action").addEventListener("click",()=>{localStorage.clear(),window.location.href="index.html"});document.getElementById("connect-wallet-btn").addEventListener("click",async()=>{try{c=await x();const t=document.getElementById("connect-wallet-btn");t.innerText="Wallet Connected",t.style.borderColor="#60a5fa",t.style.color="#60a5fa";const e=document.getElementById("wallet-address");e.style.display="block",e.innerText=`${c.substring(0,6)}...${c.substring(38)}`,n&&h()}catch(t){console.error(t),alert(t.message||"Failed to connect wallet.")}});async function E(){try{const t=await fetch("https://lexx-1.onrender.com/api/cases/allCases",{headers:{Authorization:`Bearer ${g}`}}),e=await t.json();if(!t.ok)throw new Error(e.message||"Failed to fetch");l=Array.isArray(e)?e:[],r=[...l],m()}catch(t){console.error(t),document.getElementById("case-list-container").innerHTML='<p style="color:red; text-align:center;">Error loading cases.</p>'}}function m(){const t=document.getElementById("case-list-container");if(document.getElementById("total-count").innerText=`${r.length} Items`,r.length===0){t.innerHTML='<p style="color: #666; text-align: center; margin-top: 20px;">No cases found.</p>';return}t.innerHTML=r.map(e=>{var a;return`
                <div class="case-item ${n&&n._id===e._id?"active":""}" data-id="${e._id}">
                    <div class="case-item-icon" style="color: ${e.status==="Closed"?"#10b981":"#64748b"}">
                        ${e.status==="Closed"?"🔒":"⚖️"}
                    </div>
                    <div style="flex-grow: 1;">
                        <div class="case-item-title">${e.title}</div>
                        <div class="case-item-meta">Evidence: ${((a=e.evidenceList)==null?void 0:a.length)||0} | Status: ${e.status||"Open"}</div>
                    </div>
                </div>
            `}).join(""),document.querySelectorAll(".case-item").forEach(e=>{e.addEventListener("click",()=>{const a=e.getAttribute("data-id"),s=l.find(d=>d._id===a);s&&(n=s,m(),p(),c&&h())})})}document.getElementById("case-search").addEventListener("input",t=>{const e=t.target.value.toLowerCase();r=l.filter(a=>a.title.toLowerCase().includes(e)),m()});async function h(){if(!n||!n.evidenceList||n.evidenceList.length===0)return;let t=!1;for(let e of n.evidenceList)try{const a=await C(e._id);a&&a[8]?(e.onChain=!0,e.chainStatus=Number(a[7])===1?"FALSE":"VALID",e.ipfsCID=a[3]||"",t=!0):e.onChain=!1}catch{}t&&p()}window.toggleFilter=function(){f=!f,p()};function p(){var s,d;const t=document.getElementById("main-content-container");if(!n){t.innerHTML=`
                    <div class="panel-header"><h2>Judicial Oversight</h2></div>
                    <div style="text-align:center; margin-top:100px; color:#666;">No case selected</div>
                `;return}const e=f?(n.evidenceList||[]).filter(i=>i.onChain):n.evidenceList||[];let a=`
                <div class="panel-header" style="display: flex; justify-content: space-between; align-items: flex-start;">
                    <div>
                        <p style="color: var(--accent-color); font-weight: bold; font-size: 0.8rem; letter-spacing: 1px; margin-bottom: 5px;">RULING DASHBOARD</p>
                        <h2 style="font-size: 2.5rem; margin-bottom: 5px;">${n.title}</h2>
                        <span style="color: #aaa; font-size: 0.9rem;">Status: 
                            <span style="color:${n.status==="Closed"?"#10b981":"#f59e0b"}; font-weight:bold">${n.status||"Open"}</span>
                        </span>
                    </div>
                </div>

                <div class="info-card">
                    <div>
                        <h3 style="color:#fff; margin-bottom:5px; font-size:1.1rem;">Reporting Officer Details</h3>
                        <p style="color:#aaa; font-size:0.9rem; margin:2px 0;">Name: <strong style="color:#ddd">${((s=n.officer)==null?void 0:s.name)||"N/A"}</strong></p>
                        <p style="color:#aaa; font-size:0.9rem; margin:2px 0;">Email: ${((d=n.officer)==null?void 0:d.email)||"N/A"}</p>
                        <p style="color:#aaa; font-size:0.9rem; margin:2px 0;">Case Uploaded: ${new Date(n.createdAt).toLocaleString()}</p>
                    </div>
                    <div>
                        ${n.status!=="Closed"?`<button class="btn-action btn-finalize" onclick="closeCase('${n._id}')">🔒 Finalize & Close Case</button>
                             <p style="color:#666; font-size:0.8rem; margin-top:8px; text-align:center;">Closes case off-chain</p>`:'<div style="color:#10b981; font-weight:bold; font-size:1.2rem;">Case Finalized</div>'}
                    </div>
                </div>

                <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:20px;">
                    <h3 style="color:#fff; font-size:1.3rem;">Evidences Uploaded</h3>
                    <div class="toggle-container">
                        <label class="switch">
                            <input type="checkbox" onchange="toggleFilter()" ${f?"checked":""}>
                            <span class="slider"></span>
                        </label>
                        <span>Show On-Chain Only</span>
                    </div>
                </div>
            `;e.length===0?a+='<div style="text-align:center; padding: 40px; color:#555; border:1px solid #222; border-radius:12px;">No evidence passes filter.</div>':e.forEach(i=>{var u;let w=i.onChain?i.chainStatus==="FALSE"?'<span class="badge-false">ON-CHAIN: FALSE</span>':'<span class="badge-chain">ON-CHAIN: VALID</span>':'<span style="margin-left:auto; color:#666; font-size:0.8rem;">Off-Chain</span>';a+=`
                    <div class="dash-form" style="display:flex; flex-direction:column; gap:15px; padding:20px;">
                        <div style="display:flex; align-items:center;">
                            <div style="font-size:1.5rem; margin-right:15px;">📄</div>
                            <div>
                                <h4 style="color:#fff; margin-bottom:4px;">${i.title||"Evidence Artifact"}</h4>
                                <p style="color:#888; font-size:0.85rem; margin:0;">AI Confidence: <strong style="color:#60a5fa">${((u=i.aiAnalysis)==null?void 0:u.confidence)||"N/A"}</strong></p>
                                ${i.ipfsCID?`<p style="color:#888; font-size:0.85rem; margin:4px 0 0 0;">IPFS: <a href="https://gateway.pinata.cloud/ipfs/${i.ipfsCID}" target="_blank" style="color:#60a5fa; text-decoration:none;">${i.ipfsCID.substring(0,8)}...</a></p>`:""}
                            </div>
                            ${w}
                        </div>
                        
                        <div style="display:flex; gap:10px; margin-top:10px;">
                            ${i.fileUrl?`<a href="${i.fileUrl}" target="_blank" class="btn-action" style="background:#222; border:1px solid #444; flex:1; justify-content:center;">👁️ View File</a>`:""}
                            
                            ${i.onChain&&i.chainStatus!=="FALSE"?`
                                <button class="btn-action btn-mark-false" onclick="markFalse('${i._id}')" style="flex:1;">❌ Mark False On-Chain</button>
                            `:""}
                        </div>
                    </div>
                    `}),t.innerHTML=a}window.closeCase=async function(t){if(confirm("Are you sure you want to finalize and close this case? No more evidence can be uploaded."))try{if(!(await fetch(`http://localhost:5000/api/cases/${t}/close`,{method:"PATCH",headers:{Authorization:`Bearer ${g}`}})).ok)throw new Error("Failed to close case");alert("Case finalized successfully off-chain."),n.status="Closed";const a=l.findIndex(s=>s._id===t);a>-1&&(l[a].status="Closed"),m(),p()}catch(e){console.error(e),alert("Error finalizing case.")}};window.markFalse=async function(t){if(!c)return alert("Please connect Web3 wallet to interact on-chain.");if(confirm("Are you sure you want to officially mark this evidence as FALSE on the blockchain?"))try{let e;try{e=y()}catch{await x(),e=y()}alert("Please confirm the transaction in MetaMask to mark this evidence false."),await(await e.markEvidenceFalse(t)).wait(),alert("Evidence successfully marked as FALSE on-chain!"),await h()}catch(e){console.error(e),alert("Blockchain transaction failed. "+e.message)}};E();
