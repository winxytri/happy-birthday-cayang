document.addEventListener('DOMContentLoaded', () => {
  const rand = (min, max) => Math.random() * (max - min) + min;

  /* balloons (cute stickers) */
  const balloonContainer = document.querySelector('.balloon-container');
  const balloonSrcs = [ 'cat-cake.png', 'cat-cake.png', 'cat-cake.png' ];
  function spawnBalloon(){
    const img = document.createElement('img');
    img.src = balloonSrcs[Math.floor(Math.random()*balloonSrcs.length)];
    img.className = 'balloon';
    img.style.left = rand(-5, 95) + 'vw';
    img.style.width = (rand(60,120))+'px';
    img.style.animationDuration = rand(6,14)+'s';
    img.style.opacity = rand(0.85,1);
    balloonContainer.appendChild(img);
    setTimeout(()=> img.remove(), 16000);
  }
  const balloonInterval = setInterval(spawnBalloon, 900);

  /* hearts */
  let heartInterval = null;
  const toggleHeartsBtn = document.getElementById('toggleHearts');
  function spawnHeart(){
    const heart = document.createElement('div');
    heart.className = 'heart'; heart.innerHTML = '💘';
    heart.style.left = rand(2, 94) + 'vw'; heart.style.fontSize = rand(18, 42) + 'px';
    heart.style.animationDuration = rand(4,9)+'s'; heart.style.transform = `translateY(-10vh) rotate(${rand(-45,45)}deg)`;
    document.body.appendChild(heart);
    setTimeout(()=> heart.remove(), 10000);
  }
  toggleHeartsBtn.addEventListener('click', ()=>{
    if(!heartInterval){
      heartInterval = setInterval(spawnHeart, 300);
      toggleHeartsBtn.textContent = '💤 Hentikan Hujan Hati';
      toggleHeartsBtn.classList.add('active');
    } else {
      clearInterval(heartInterval); heartInterval = null;
      toggleHeartsBtn.textContent = '💘 Hujan Hati';
      toggleHeartsBtn.classList.remove('active');
    }
  });

  /* typewriter */
  const typedEl = document.getElementById('typed');
  const surpriseBtn = document.getElementById('surpriseBtn');
  if (surpriseBtn) surpriseBtn.style.display = 'none';

  const openingLines = [
    "Hari ini adalah hari yang begitu spesial, karena tepat di hari ini kamu bertambah usia.",
    "",
    "Semoga semua harapan kamu terwujud, kebahagiaan kamu terus bertambah di setiap waktunya, dan setiap mimpi indah kamu menemukan jalan untuk menjadi nyata."
  ];
  const mainLines = [
    "Terima kasih sudah selalu ada, dalam suka maupun duka.",
    "Setiap momen bersama kamu adalah hadiah terindah yang pernah aku dapatkan.",
    "",
    "Semoga di umur kamu saat ini, kamu selalu dikelilingi cinta, tawa, dan kebahagiaan, Jangan pernah ragu untuk bermimpi, karena aku bakalan selalu mendukung kamu.",
    "",
    "Tetaplah menjadi orang yang selalu manis, lucu, dan penuh semangat.",
    "",
    "Selamat ulang tahun, sayang. Semoga semua yang terbaik selalu untukmu! 🎂💖"
  ];
  let lineIndex = 0, charIndex = 0, currentLines = openingLines;
  function typeLoop(){
    if(lineIndex >= currentLines.length) {
      // Jika sudah selesai openingLines, ganti ke mainLines
      if(currentLines === openingLines) {
        setTimeout(()=>{
          typedEl.innerHTML = '';
          currentLines = mainLines;
          lineIndex = 0; charIndex = 0;
          typeLoop();
        }, 1200);
        return;
      } else {
        // Selesai semua pesan, tampilkan tombol surpriseBtn
        if (surpriseBtn) surpriseBtn.style.display = '';
        return;
      }
    }
    const line = currentLines[lineIndex];
    if(charIndex < line.length){
      typedEl.innerHTML += line.charAt(charIndex);
      charIndex++; setTimeout(typeLoop, 36);
    } else {
      typedEl.innerHTML += '<br>';
      lineIndex++; charIndex = 0; setTimeout(typeLoop, 680);
    }
  }
  setTimeout(typeLoop, 700);

  /* confetti + bear */
  // Bear element for main card and virtual hug modal
  let bear = document.getElementById('bear');
  const confettiCanvas = document.getElementById('confettiCanvas');
  const ctx = confettiCanvas.getContext('2d');
  let confettiPieces = [];
  function resizeCanvas(){ confettiCanvas.width = window.innerWidth; confettiCanvas.height = window.innerHeight; }
  window.addEventListener('resize', resizeCanvas); resizeCanvas();
  function createConfetti(x,y){
    for(let i=0;i<60;i++){
      confettiPieces.push({ x: x + rand(-60,60), y: y + rand(-20,20), vx: rand(-6,6), vy: rand(-8, -2), size: rand(6,12), color: ['#FF6B9A','#FFD166','#FFB4C6','#9AD3BC'][Math.floor(rand(0,4))], rot: rand(0,360) });
    }
  }
  function updateConfetti(){
    ctx.clearRect(0,0,confettiCanvas.width, confettiCanvas.height);
    for(let i=confettiPieces.length-1;i>=0;i--){
      const p = confettiPieces[i]; p.vy += 0.25; p.x += p.vx; p.y += p.vy; p.rot += 8;
      ctx.save(); ctx.translate(p.x,p.y); ctx.rotate(p.rot * Math.PI/180);
      ctx.fillStyle = p.color; ctx.fillRect(-p.size/2, -p.size/2, p.size, p.size*0.6);
      ctx.restore(); if(p.y > confettiCanvas.height + 50) confettiPieces.splice(i,1);
    }
    requestAnimationFrame(updateConfetti);
  }
  updateConfetti();

  // sound effects + audio handling
  const audio = document.getElementById('localAudio');
  const bearSfx = document.getElementById('bearSfx');
  const giftSfx = document.getElementById('giftSfx');
  const playBtn = document.getElementById('playMusic');
  const volumeRange = document.getElementById('volumeRange');
  const audioProgress = document.getElementById('audioProgress');
  audio.loop = true; audio.volume = parseFloat(volumeRange.value || 0.9);
  // keep sfx volume in sync with main slider (user expects one volume control)
  function syncSfxVolume(){ const v = parseFloat(volumeRange.value || 0.9); [bearSfx, giftSfx].forEach(s => { try{ s.volume = Math.min(1, Math.max(0, v)); }catch(e){} }); }
  syncSfxVolume();
  volumeRange.addEventListener('input', ()=>{ audio.volume = parseFloat(volumeRange.value); syncSfxVolume(); });

  let playing = false;
  function updatePlayBtnState(){ if(!playing){ playBtn.textContent = '🔊 Putar'; playBtn.classList.remove('btn-danger'); playBtn.classList.add('btn-outline-danger'); } else { playBtn.textContent = '🔈 Hentikan'; playBtn.classList.remove('btn-outline-danger'); playBtn.classList.add('btn-danger'); } }
  updatePlayBtnState();

  playBtn.addEventListener('click', async ()=>{
    try{ if(!playing){ await audio.play(); playing = true; } else { audio.pause(); playing = false; } }catch(err){ alert('Browser memblokir autoplay. Klik lagi untuk mengizinkan audio.'); }
    updatePlayBtnState();
  });
  audio.addEventListener('play', ()=>{ playing = true; updatePlayBtnState(); }); audio.addEventListener('pause', ()=>{ playing = false; updatePlayBtnState(); });

  // progress updater
  setInterval(()=>{
    if(audio && audio.duration && audio.currentTime >= 0){
      const pct = Math.max(0, Math.min(100, (audio.currentTime / audio.duration) * 100));
      audioProgress.style.width = pct + '%';
    }
  }, 250);

  // keyboard space = toggle play when focus not on input
  window.addEventListener('keydown', (e)=>{ if(e.code === 'Space' && document.activeElement.tagName !== 'INPUT' && document.activeElement.tagName !== 'TEXTAREA'){ e.preventDefault(); playBtn.click(); } });

  function attachBearListeners() {
    // Attach for main card
    bear = document.getElementById('bear');
    if (bear) {
      bear.onclick = triggerBearHug;
      bear.onkeydown = (e) => { if(e.key === 'Enter' || e.key === ' ') triggerBearHug(); };
    }
    // Attach for virtual hug modal
    const bearHug = document.getElementById('bearHug');
    if (bearHug) {
      bearHug.onclick = triggerBearHug;
      bearHug.onkeydown = (e) => { if(e.key === 'Enter' || e.key === ' ') triggerBearHug(); };
    }
  }
  attachBearListeners();
  function triggerBearHug(){
    bear.classList.add('bubble'); setTimeout(()=> bear.classList.remove('bubble'), 700);
    const rect = bear.getBoundingClientRect(); createConfetti(rect.left + rect.width/2, rect.top + rect.height/2);
    const pop = document.createElement('div');
    pop.style.position='fixed'; pop.style.left= (rect.left + rect.width/2 - 90)+'px'; pop.style.top=(rect.top - 24)+'px';
    pop.style.padding='8px 12px'; pop.style.background='rgba(255,255,255,0.98)'; pop.style.borderRadius='999px'; pop.style.boxShadow='0 8px 28px rgba(0,0,0,0.08)';
    pop.style.fontFamily='Comfortaa, cursive'; pop.style.color='#6d294c'; pop.style.zIndex=2000; pop.textContent = 'Peluk, sayang! 🐻💕'; document.body.appendChild(pop);
    setTimeout(()=> pop.remove(),1400);
    // play bear sfx (non-blocking)
    try{ if(bearSfx && typeof bearSfx.play === 'function'){ bearSfx.currentTime = 0; bearSfx.play().catch(()=>{}); } }catch(e){}
  }

  /* surprise -> show gift modal */
  // const surpriseBtn = document.getElementById('surpriseBtn'); // Already declared above
  const giftModal = document.getElementById('giftModal'); const giftBox = document.getElementById('giftBox'); const openGift = document.getElementById('openGift'); const closeGift = document.getElementById('closeGift'); const pdfWrap = document.getElementById('pdfWrap'); const pdfBtn = document.getElementById('pdfBtn');

  surpriseBtn.addEventListener('click', ()=>{ giftModal.classList.add('active'); createConfetti(window.innerWidth/2, window.innerHeight/2); });
  closeGift.addEventListener('click', ()=>{ giftModal.classList.remove('active'); });

    openGift.addEventListener('click', async ()=>{
      giftBox.classList.add('open');
      setTimeout(()=>{
        try{ if(giftSfx && typeof giftSfx.play === 'function'){ giftSfx.currentTime = 0; giftSfx.play().catch(()=>{}); } }catch(e){}
        document.getElementById('giftMsg').classList.remove('visually-hidden');
        giftModal.classList.remove('active');
        createConfetti(window.innerWidth/2, window.innerHeight/2);
        if(!audio.paused){ audio.currentTime = Math.max(0, audio.currentTime - 0.2); }
        // Save audio state before redirect
        localStorage.setItem('audioPlaying', !audio.paused ? 'true' : 'false');
        localStorage.setItem('audioTime', audio.currentTime);
        setTimeout(()=>{
          window.location.href = 'bear-hug.html';
        }, 900); // 900ms for animation and sfx
      }, 420); // 420ms aligns with lid animation for snappy feeling
    });

  // Close virtual hug modal
  const closeHug = document.getElementById('closeHug');
  if(closeHug){
    closeHug.addEventListener('click', ()=>{
      const hugModal = document.getElementById('virtualHugModal');
      if(hugModal) hugModal.style.display = 'none';
    });
  }

  /* preview message quick show */
  document.getElementById('previewMsg').addEventListener('click', ()=>{
    const preview = document.createElement('div'); preview.className = 'preview-toast'; preview.innerHTML = '<strong>Pesan:</strong><br>' + messageLines.join('<br>');
    Object.assign(preview.style,{ position:'fixed', right:'18px', bottom:'18px', background:'white', padding:'12px 14px', borderRadius:'12px', boxShadow:'0 12px 30px rgba(0,0,0,0.08)', zIndex:3000, fontFamily:'Poppins, sans-serif' });
    document.body.appendChild(preview); setTimeout(()=> preview.remove(),3500);
  });

  /* reduced motion handling */
  const mq = window.matchMedia('(prefers-reduced-motion: reduce)'); if(mq.matches){ clearInterval(balloonInterval); if(heartInterval) clearInterval(heartInterval); }

  /* small sparkles on load */
  for(let i=0;i<8;i++){ const s = document.createElement('div'); s.className='sparkle'; s.style.left = rand(4,92)+'%'; s.style.top = rand(6,28)+'%'; s.style.opacity = rand(0.3,0.9); document.body.appendChild(s); setTimeout(()=> s.remove(), 4000 + i*500); }

});
