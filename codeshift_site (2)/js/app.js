// --- 1. LOCAL PERSISTENT STORAGE STATE SYSTEM via COOKIES ---
const COOKIE_NAME = "CODESHIFT_PLATFORM_STATE_v3";

let SYSTEM_STATE = {
    myProfile: null, // Initialized only upon successful account sign-up card submission
    followedCreators: [],
    likes: {}, // { slideIndex: boolean }
    userComments: {}, // { slideIndex: Array }
    publishedVideos: [] // Custom user additions array
};

function saveStateToCookies() {
    const d = new Date();
    d.setTime(d.getTime() + (365 * 24 * 60 * 60 * 1000));
    document.cookie = `${COOKIE_NAME}=${encodeURIComponent(JSON.stringify(SYSTEM_STATE))};expires=${d.toUTCString()};path=/;SameSite=Strict`;
}

function loadStateFromCookies() {
    const cookies = document.cookie.split(';');
    for(let i=0; i<cookies.length; i++) {
        let c = cookies[i].trim();
        if(c.indexOf(COOKIE_NAME + "=") === 0) {
            try {
                const parsed = JSON.parse(decodeURIComponent(c.substring(COOKIE_NAME.length + 1)));
                if(parsed) SYSTEM_STATE = parsed;
            } catch(e) { console.error("Cookie structure parsing corrupted. Resetting state.", e); }
        }
    }
}
loadStateFromCookies();

// --- 2. PROCEDURAL MATH SEED GENERATION FOR INDEPENDENT AVATARS ---
function drawProceduralPFP(canvasId, seedString) {
    const canvas = typeof canvasId === 'string' ? document.getElementById(canvasId) : canvasId;
    if(!canvas) return;
    const ctx = canvas.getContext('2d');
    const w = canvas.width = 64;
    const h = canvas.height = 64;

    // Generate numeric digest hash from handle string to establish color spaces
    let hash = 0;
    for (let i = 0; i < seedString.length; i++) {
        hash = seedString.charCodeAt(i) + ((hash << 5) - hash);
    }

    const hue1 = Math.abs(hash % 360);
    const hue2 = (hue1 + 140) % 360;

    // Clear with abstract vector gradient
    let grad = ctx.createLinearGradient(0, 0, w, h);
    grad.addColorStop(0, `hsl(${hue1}, 85%, 35%)`);
    grad.addColorStop(1, `hsl(${hue2}, 90%, 15%)`);
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, w, h);

    // Draw internal geometric matrix overlay
    ctx.strokeStyle = `rgba(255, 255, 255, 0.25)`;
    ctx.lineWidth = 2;
    ctx.beginPath();
    for(let i=4; i<w; i+=12) {
        ctx.moveTo(i, 0); ctx.lineTo(w - i, h);
        ctx.moveTo(0, i); ctx.lineTo(w, h - i);
    }
    ctx.stroke();

    // Foreground structural central core
    ctx.fillStyle = `hsl(${(hue1 + 180)%360}, 95%, 60%)`;
    ctx.beginPath();
    ctx.arc(w/2, h/2, 10, 0, Math.PI * 2);
    ctx.fill();
}

// --- 3. HARDWARE BASELINE FEED ARRAY STRUCTURES ---
const STATIC_FEED = [
    {
        handle: "@LinearAlgebra",
        caption: "Computing multi-layer canvas coordinate interpolation matrices natively. #1 Rules enforced.",
        isVibecoded: false,
        code: "ctx.strokeStyle = '#00ffaa';\nctx.lineWidth = 2;\nfor(let i=0; i<w; i+=30) {\n  ctx.beginPath();\n  let offset = Math.sin(t * 3 + i * 0.05) * 25;\n  ctx.moveTo(i, 0);\n  ctx.lineTo(i + offset, h);\n  ctx.stroke();\n}"
    },
    {
        handle: "@AlgorithmicArt",
        caption: "Procedural layout parsing showing deep cosmic resonance waveforms. Pure vibecoding.",
        isVibecoded: true,
        code: "let cx = w/2, cy = h/2;\nctx.fillStyle = '#ffaa00';\nctx.beginPath();\nctx.arc(cx, cy, 40 + Math.sin(t*4)*15, 0, Math.PI*2);\nctx.fill();\n\nctx.strokeStyle = '#00aaff';\nctx.lineWidth = 1.5;\nctx.beginPath();\nctx.arc(cx, cy, 90 + Math.cos(t*2)*20, 0, Math.PI*2);\nctx.stroke();"
    }
];

function getCombinedFeed() {
    return STATIC_FEED.concat(SYSTEM_STATE.publishedVideos);
}

// --- 4. VIEW RENDERING ENGINE IMPLEMENTATION ---
let currentIdx = 0;
const mainCanvas = document.getElementById('render-viewport');
const mainCtx = mainCanvas.getContext('2d');

function syncAppHUD() {
    const feed = getCombinedFeed();
    if(feed.length === 0) return;

    const currentItem = feed[currentIdx];
    document.getElementById('index-counter').innerText = `Feed: ${currentIdx + 1} / ${feed.length}`;
    document.getElementById('hud-handle').innerText = currentItem.handle;
    document.getElementById('hud-caption').innerText = currentItem.caption;

    // Trigger vector avatar drawing procedures
    drawProceduralPFP('hud-pfp', currentItem.handle);

    // Toggle VibeCoded Verification Badge Visibility
    const vibeBadge = document.getElementById('hud-vibe-badge');
    vibeBadge.style.display = currentItem.isVibecoded ? 'inline-block' : 'none';

    // Verify Like Metrics State Counts
    const isLiked = SYSTEM_STATE.likes[currentIdx] || false;
    const heart = document.getElementById('like-heart');
    const metricLabel = document.getElementById('like-metric');
    
    metricLabel.innerText = isLiked ? "Liked" : Math.floor(12 + (currentIdx * 7));
    if(isLiked) heart.classList.add('active-red'); else heart.classList.remove('active-red');

    // Follow Toggle Indicators Updates
    const followTrigger = document.getElementById('follow-trigger');
    if(SYSTEM_STATE.myProfile.handle === currentItem.handle) {
        followTrigger.style.display = 'none';
    } else {
        followTrigger.style.display = 'inline-block';
        if(SYSTEM_STATE.followedCreators.includes(currentItem.handle)) {
            followTrigger.innerText = "FOLLOWING";
            followTrigger.style.background = "#2d3748";
            followTrigger.style.color = "#a0aec0";
        } else {
            followTrigger.innerText = "FOLLOW";
            followTrigger.style.background = "#00ffaa";
            followTrigger.style.color = "#000";
        }
    }

    // Fetch comments length metrics
    const userCmts = SYSTEM_STATE.userComments[currentIdx] || [];
    document.getElementById('comment-metric').innerText = 2 + userCmts.length;
}

function startMainRenderingPipeline() {
    mainCanvas.width = mainCanvas.clientWidth;
    mainCanvas.height = mainCanvas.clientHeight;

    function renderLoop() {
        const t = performance.now() * 0.001;
        const w = mainCanvas.width;
        const h = mainCanvas.height;

        // Draw calibrated high contrast dark baseline background clears
        let grad = mainCtx.createLinearGradient(0, 0, 0, h);
        grad.addColorStop(0, '#040408');
        grad.addColorStop(0.5, '#090b16');
        grad.addColorStop(1, '#020204');
        mainCtx.fillStyle = grad;
        mainCtx.fillRect(0, 0, w, h);

        const feed = getCombinedFeed();
        if(feed.length > 0) {
            const currentItem = feed[currentIdx];
            try {
                const executionBlock = new Function('ctx', 't', 'w', 'h', currentItem.code);
                executionBlock(mainCtx, t, w, h);
            } catch(err) {
                mainCtx.fillStyle = '#ff0055';
                mainCtx.font = '11px monospace';
                mainCtx.fillText(`⚠ CORE_COMPILER_ERR: ${err.message}`, 20, 100);
            }
        }
        requestAnimationFrame(renderLoop);
    }
    requestAnimationFrame(renderLoop);
}

// --- 5. INTERACTIVE ACCOUNT SETUP CONTROL FLOW ROUTINES ---
document.getElementById('register-submit-btn').addEventListener('click', () => {
    const inputHandle = document.getElementById('reg-handle').value.trim();
    const inputBio = document.getElementById('reg-bio').value.trim();

    if(!inputHandle) {
        alert("Developer handle cannot remain blank.");
        return;
    }

    const formattedHandle = inputHandle.startsWith('@') ? inputHandle : '@' + inputHandle;

    // Establish Account Profile Details Parameters
    SYSTEM_STATE.myProfile = {
        handle: formattedHandle,
        bio: inputBio || "Full-stack computational software engineer.",
        createdTimestamp: Date.now()
    };

    saveStateToCookies();
    bootAppInterface();
});

function bootAppInterface() {
    if(!SYSTEM_STATE.myProfile) return;

    // Mask registration layout, display active environment
    document.getElementById('auth-screen').style.display = 'none';
    document.getElementById('main-viewport').style.display = 'flex';

    // Synchronize user profile nodes layout details
    document.getElementById('my-profile-handle').innerText = SYSTEM_STATE.myProfile.handle;
    document.getElementById('my-profile-bio').innerText = SYSTEM_STATE.myProfile.bio;
    drawProceduralPFP('my-profile-pfp', SYSTEM_STATE.myProfile.handle);

    syncAppHUD();
    rebuildMyUploadsGrid();
    startMainRenderingPipeline();
}

// Check onboarding clearance states instantly upon startup execution loops
if(SYSTEM_STATE.myProfile) {
    bootAppInterface();
}

// --- 6. SCREEN ROUTING TAB NAVIGATION MANAGEMENT ---
document.querySelectorAll('.nav-tab').forEach(tab => {
    tab.addEventListener('click', () => {
        document.querySelectorAll('.nav-tab').forEach(t => t.classList.remove('active'));
        document.querySelectorAll('.app-screen').forEach(s => s.classList.remove('active'));

        tab.classList.add('active');
        const targetScreen = tab.getAttribute('data-target');
        document.getElementById(targetScreen).classList.add('active');

        closeAllTrays();
        if(targetScreen === 'screen-home') syncAppHUD();
    });
});

// --- 7. COMMENTS TERMINAL COMPONENT SUB SYSTEMS ---
document.getElementById('comments-trigger').addEventListener('click', () => {
    const log = document.getElementById('comments-log');
    log.innerHTML = '';

    const baseComments = [
        { u: "@StackOverlord", t: "Transform loops are remarkably well optimized here." },
        { u: "@HexHacker", t: "Rule #1 compliance verified. Solid visual modification." }
    ];

    const customUserEntries = SYSTEM_STATE.userComments[currentIdx] || [];
    const absoluteArray = baseComments.concat(customUserEntries);

    absoluteArray.forEach(c => {
        const row = document.createElement('div');
        row.className = "cmt-node";
        
        // Dynamically instantiate procedural canvases inside individual comment streams
        const pfpCanvas = document.createElement('canvas');
        pfpCanvas.className = "comment-pfp";
        
        const textBlock = document.createElement('div');
        textBlock.className = "comment-text-block";
        textBlock.innerHTML = `<span class="comment-user">${c.u}</span><span>${c.t}</span>`;

        row.appendChild(pfpCanvas);
        row.appendChild(textBlock);
        log.appendChild(row);

        drawProceduralPFP(pfpCanvas, c.u);
    });

    document.getElementById('comments-tray').classList.add('open');
});

document.getElementById('post-comment-btn').addEventListener('click', () => {
    const field = document.getElementById('comment-field');
    const val = field.value.trim();
    if(!val) return;

    if(!SYSTEM_STATE.userComments[currentIdx]) SYSTEM_STATE.userComments[currentIdx] = [];
    SYSTEM_STATE.userComments[currentIdx].push({
        u: SYSTEM_STATE.myProfile.handle,
        t: val
    });

    field.value = '';
    saveStateToCookies();
    document.getElementById('comments-trigger').click(); // Refresh comment log updates instantly
});

// Like Toggles
document.getElementById('like-trigger').addEventListener('click', () => {
    SYSTEM_STATE.likes[currentIdx] = !SYSTEM_STATE.likes[currentIdx];
    if(SYSTEM_STATE.likes[currentIdx]) SYSTEM_STATE.myProfile.likesCount = (SYSTEM_STATE.myProfile.likesCount || 0) + 1;
    saveStateToCookies();
    syncAppHUD();
    document.getElementById('my-profile-likes').innerText = SYSTEM_STATE.likesCount || Object.keys(SYSTEM_STATE.likes).length;
});

// Follow Toggles
document.getElementById('follow-trigger').addEventListener('click', () => {
    const currentCreator = getCombinedFeed()[currentIdx].handle;
    const fIndex = SYSTEM_STATE.followedCreators.indexOf(currentCreator);
    if(fIndex > -1) {
        SYSTEM_STATE.followedCreators.splice(fIndex, 1);
    } else {
        SYSTEM_STATE.followedCreators.push(currentCreator);
    }
    saveStateToCookies();
    syncAppHUD();
});

// Rules Manifesto Tray Toggle
document.getElementById('rules-trigger').addEventListener('click', () => {
    document.getElementById('rules-tray').classList.add('open');
});

function closeAllTrays() {
    document.getElementById('comments-tray').classList.remove('open');
    document.getElementById('rules-tray').classList.remove('open');
}

// --- 8. STUDIO CREATION AND STACK COMPILING BLUEPRINTS ---
document.getElementById('publish-video-btn').addEventListener('click', () => {
    const cap = document.getElementById('studio-caption').value.trim();
    const codeSrc = document.getElementById('studio-code').value.trim();
    const isVibe = document.getElementById('studio-vibe-toggle').checked;

    if(!cap || !codeSrc) {
        alert("Both execution script source arrays and description caption strings must be populated.");
        return;
    }

    // Build the new code video entry object
    const newVideoNode = {
        handle: SYSTEM_STATE.myProfile.handle,
        caption: cap,
        isVibecoded: isVibe,
        code: codeSrc
    };

    SYSTEM_STATE.publishedVideos.push(newVideoNode);
    saveStateToCookies();

    // Reset Creation Elements Values
    document.getElementById('studio-caption').value = '';
    document.getElementById('studio-vibe-toggle').checked = false;

    // Direct routing instantly back to feed layout parameters
    rebuildMyUploadsGrid();
    document.querySelector('[data-target="screen-home"]').click();
    
    // Jump straight to the newly uploaded video node index
    currentIdx = getCombinedFeed().length - 1;
    syncAppHUD();

    showGlobalToast("⚡ CodeCompiled & Published!");
});

function rebuildMyUploadsGrid() {
    const grid = document.getElementById('my-uploads-grid');
    grid.innerHTML = '';

    const myVideos = SYSTEM_STATE.publishedVideos;
    document.getElementById('my-profile-subs').innerText = myVideos.length * 4;
    document.getElementById('my-profile-likes').innerText = Object.keys(SYSTEM_STATE.likes).length;

    if(myVideos.length === 0) {
        grid.innerHTML = `<div style="grid-column: span 3; font-size:10px; color:#4a5568; text-align:center; padding:20px 0;">No active uploaded compiled tracks found.</div>`;
        return;
    }

    myVideos.forEach((v, i) => {
        const tile = document.createElement('div');
        tile.className = "grid-tile";
        tile.style.background = "linear-gradient(135deg, #090a15 0%, #ff005511 100%)";
        tile.innerText = `▶ Active Loop #${i+1}`;
        grid.appendChild(tile);
    });
}

// Global Interaction Gestures Listeners (Mouse scrolls down feeds)
let activeScrollTimer;
window.addEventListener('wheel', (e) => {
    if(activeScrollTimer || document.getElementById('screen-home').className.indexOf('active') === -1) return;
    if(Math.abs(e.deltaY) > 35) {
        let dir = e.deltaY > 0 ? 1 : -1;
        let next = currentIdx + dir;
        const feed = getCombinedFeed();
        if(next >= 0 && next < feed.length) {
            currentIdx = next;
            syncAppHUD();
            closeAllTrays();
        }
        activeScrollTimer = setTimeout(() => { activeScrollTimer = null; }, 500);
    }
}, { passive: true });

function showGlobalToast(text) {
    const toast = document.getElementById('toast');
    toast.innerText = text; toast.style.opacity = 1;
    setTimeout(() => { toast.style.opacity = 0; }, 2500);
}