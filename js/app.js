// =========================================================================
        //                      GLOBAL PORTFOLIO CONFIGURATION
        // =========================================================================
        // #region 3. GLOBAL CONFIGURATION
        /*
        ################################################################################
        ################################################################################
        #                                                                              #
        #                 3.  G L O B A L   C O N F I G U R A T I O N                  #
        #                                                                              #
        ################################################################################
        ################################################################################
        */
        const CONFIG = {
            // ==========================================
            // >>> 1. ADD NEW GAMES HERE! <<<
            // ==========================================
            // Add, delete, or modify games in the array below.
            // SCHEMA:
            // - id: unique string key
            // - title: all-caps title text
            // - thumbnail: cover URL (leave as "" for automatic scraping/resolution!)
            // - type: "webgl" (for browser-playable) or "download" (external link)
            // - embedUrl: (webgl only) direct itch.io iframe widget source URL
            // - pageUrl: public game page link
            // - views: custom page statistic
            // - tag: genre category tag
            games: [
                { id: "scraping-angel", title: "SCRAPING ANGEL", thumbnail: "https://img.itch.zone/aW1nLzI2MDQwMjMzLnBuZw==/original/pSkFGy.png", type: "download", pageUrl: "https://reirann.itch.io/scraping-angel", views: "1.2K", tag: "Horror" },
                { id: "sky-slime", title: "SKY SLIME", thumbnail: "https://img.itch.zone/aW1nLzI1MzY3NDgyLnBuZw==/original/fLhHy8.png", type: "download", pageUrl: "https://lakshmanragu.itch.io/sky-slimed", views: "840", tag: "Platformer" },
                { id: "the-long-take", title: "THE LONG TAKE", thumbnail: "https://img.itch.zone/aW1nLzI3NTMwMTY0LnBuZw==/original/k5wp6v.png", type: "webgl", embedUrl: "https://itch.io/embed-upload/17713237?color=000000", pageUrl: "https://lakshmanragu.itch.io/the-long-take", views: "2.4K", tag: "Action" },
                { id: "blast-rock", title: "BLAST ROCK", thumbnail: "https://img.itch.zone/aW1nLzI2NTYwODgwLnBuZw==/original/yr7Cwf.png", type: "download", pageUrl: "https://itch.io/jam/portfolio-builders-jam-week-67/rate/4455852", views: "450", tag: "Shooter" },
                { id: "welcome-back", title: "WELCOME BACK", thumbnail: "https://img.itch.zone/aW1nLzI0MzIwMzE0LmpwZw==/original/HDeO4o.jpg", type: "download", pageUrl: "https://reirann.itch.io/welcome-back", views: "3.1K", tag: "Adventure" },
                { id: "grow-a-city", title: "GROW A CITY", thumbnail: "https://img.itch.zone/aW1nLzI2MjYzNzk4LmpwZWc=/original/aD%2BjHl.jpeg", type: "download", pageUrl: "https://reirann.itch.io/grow-a-city", views: "900", tag: "Strategy" },
                { id: "parking-lot", title: "ESCAPE PARKING LOT", thumbnail: "https://img.itch.zone/aW1nLzI2NjYwMTE2LnBuZw==/original/2O2isW.png", type: "download", pageUrl: "https://jeiz.itch.io/escape-the-parking-lot", views: "1.5K", tag: "Combat" }
            ],

            // Default states and quantities for visual effects
            vfx: {
                stars: true,
                drift: true,
                particles: true,
                trail: true,
                burst: true,
                starCount: 150,     // Total background stars
                particleCount: 35,  // Total floating particles
                burstCount: 12      // Particle count per click-burst
            },

            // Addressable Gamer RGB Mode configurations
            rgbMode: {
                defaultSpeed: 3,
                intervalMs: 25,
                offsets: {
                    zone1: 0,   // HSL main accent offset
                    zone2: 90,  // HSL secondary (sidebar/icons) offset
                    zone3: 180, // HSL Enderman eyes offset
                    zone4: 270  // HSL void background glow offset
                }
            }
        };
        // #endregion

        // Backwards-compatible globals mapped to CONFIG
        const MY_ITCH_GAMES = CONFIG.games;
        let vfxConfig = {
            stars: CONFIG.vfx.stars,
            drift: CONFIG.vfx.drift !== undefined ? CONFIG.vfx.drift : true,
            particles: CONFIG.vfx.particles,
            trail: CONFIG.vfx.trail,
            burst: CONFIG.vfx.burst
        };
        let recentGames = [];
        let favoriteGames = [];
        let activeGame = null;
    


        // #region 4. LOCAL STORAGE HELPER
        /*
        ################################################################################
        ################################################################################
        #                                                                              #
        #                 4.  L O C A L   S T O R A G E   H E L P E R                  #
        #                                                                              #
        ################################################################################
        ################################################################################
        */
        // Robust Storage Fallback for sandboxed iframes
        const Storage = {
            save: function (key, val) {
                const str = typeof val === 'string' ? val : JSON.stringify(val);
                try {
                    localStorage.setItem(key, str);
                    return;
                } catch (e) { }
                try {
                    sessionStorage.setItem(key, str);
                } catch (e) { }
            },
            load: function (key) {
                try {
                    const val = localStorage.getItem(key);
                    if (val !== null) return val;
                } catch (e) { }
                try {
                    const val = sessionStorage.getItem(key);
                    if (val !== null) return val;
                } catch (e) { }
                return null;
            }
        };

        // Load State
        try {
            const recents = Storage.load('recents');
            if (recents) recentGames = JSON.parse(recents);

            const favorites = Storage.load('favorites');
            if (favorites) favoriteGames = JSON.parse(favorites);

            const vfx = Storage.load('vfxConfig');
            if (vfx) {
                vfxConfig = JSON.parse(vfx);
                if (vfxConfig.drift === undefined) vfxConfig.drift = true;
            }

            const savedRGB = Storage.load('rgbMode');
            const isRGBActive = savedRGB && JSON.parse(savedRGB);
            if (!isRGBActive) {
                const color = Storage.load('themeColor') || '#ff007f';
                setTimeout(() => setThemeColor(color, null, true), 100);
            }
        } catch (e) { console.warn("Storage restricted, using in-memory fallbacks."); }
        // #endregion
    


        // #region 5. RENDERING HANDLERS
        /*
        ################################################################################
        ################################################################################
        #                                                                              #
        #                 5.  R E N D E R I N G   H A N D L E R S                      #
        #                                                                              #
        ################################################################################
        ################################################################################
        */
        async function resolveThumbnail(game) {
            if (game.thumbnail && game.thumbnail.trim() !== "") {
                return game.thumbnail;
            }
            // Scraping cover image dynamically using allorigins JSON proxy to bypass CORS
            try {
                const proxyUrl = `https://api.allorigins.win/raw?url=${encodeURIComponent(game.pageUrl)}`;
                const res = await fetch(proxyUrl);
                if (!res.ok) throw new Error("CORS Proxy error");
                const html = await res.text();

                const parser = new DOMParser();
                const doc = parser.parseFromString(html, 'text/html');

                // 1. Try standard Open Graph / Twitter image tags
                const ogImg = doc.querySelector('meta[property="og:image"]')?.getAttribute('content') ||
                    doc.querySelector('meta[name="twitter:image"]')?.getAttribute('content');
                if (ogImg) return ogImg;

                // 2. Try header or screenshot image elements on page
                const coverImg = doc.querySelector('.header_image')?.getAttribute('src') ||
                    doc.querySelector('.game_screenshot img')?.getAttribute('src') ||
                    doc.querySelector('.header img')?.getAttribute('src');
                if (coverImg) return coverImg;
            } catch (e) {
                console.warn(`Could not auto-fetch cover thumbnail for ${game.title}. Falling back.`, e);
            }
            // Fallback to stylized retro title image if scraping fails
            return `https://placehold.co/315x250/111111/ea007f?text=${encodeURIComponent(game.title)}`;
        }

        function updateMissingThumbnails() {
            const thumbDivs = document.querySelectorAll('.game-thumb[data-needs-thumbnail="true"]');
            thumbDivs.forEach(async (div) => {
                const gameId = div.getAttribute('data-game-id');
                const game = MY_ITCH_GAMES.find(g => g.id === gameId);
                if (!game) return;

                // Resolve cover URL asynchronously
                const imgUrl = await resolveThumbnail(game);

                // Apply cover background, remove loading indicator, and fade in smoothly
                div.style.backgroundImage = `url('${imgUrl}')`;
                div.classList.remove('loading-thumb');
                div.removeAttribute('data-needs-thumbnail');

                const spinner = div.querySelector('.thumb-spinner');
                if (spinner) spinner.remove();

                // Cache cover link so it does not query again during this session
                game.thumbnail = imgUrl;
            });
        }

        function renderGameCard(game) {
            const isFav = favoriteGames.includes(game.id);
            const favIcon = isFav ? "fa-solid fa-star" : "fa-regular fa-star";
            const favClass = isFav ? "favorited" : "";
            const actionIcon = game.type === 'webgl' ? 'fa-play' : 'fa-download';
            const actionText = game.type === 'webgl' ? 'PLAY' : 'DOWNLOAD';

            const hasThumb = game.thumbnail && game.thumbnail.trim() !== "";
            const thumbStyle = hasThumb ? `background-image: url('${game.thumbnail}')` : '';
            const needsThumbAttr = hasThumb ? '' : `data-needs-thumbnail="true" data-game-id="${game.id}"`;

            return `
            <div class="game-card box" data-tilt data-tilt-max="15" data-tilt-speed="400" data-tilt-glare data-tilt-max-glare="0.2">
                <button class="fav-btn ${favClass}" onclick="toggleFavorite('${game.id}', event)" title="Toggle Favorite">
                    <i class="${favIcon}"></i>
                </button>
                <div class="game-thumb ${hasThumb ? '' : 'loading-thumb'}" ${needsThumbAttr} style="${thumbStyle}" onclick="handleGameClick('${game.id}')">
                    ${hasThumb ? '' : '<i class="fa-solid fa-spinner fa-spin thumb-spinner"></i>'}
                </div>
                <h3 class="game-title" onclick="handleGameClick('${game.id}')">${game.title}</h3>
                <div class="game-stats">
                    <span><i class="fa-solid fa-tag"></i> ${game.tag}</span>
                    <span><i class="fa-solid ${actionIcon}"></i> ${actionText}</span>
                </div>
            </div>
        `;
        }

        function renderSection(containerId, gamesArray, emptyMessage) {
            const container = document.getElementById(containerId);
            if (!container) return;

            if (gamesArray.length === 0) {
                container.innerHTML = `<div style="width: 100%; text-align: center;">${emptyMessage}</div>`;
                container.classList.add('empty-row');
            } else {
                container.innerHTML = gamesArray.map(g => renderGameCard(g)).join('');
                container.classList.remove('empty-row');
                
                // Initialize vanilla-tilt for the newly added cards
                if (window.VanillaTilt) {
                    VanillaTilt.init(container.querySelectorAll('.game-card'));
                }
            }
        }

        function renderAll() {
            const webglGames = MY_ITCH_GAMES.filter(g => g.type === 'webgl');
            const downloadGames = MY_ITCH_GAMES.filter(g => g.type === 'download');

            renderSection('row-webgl', webglGames, "NO BROWSER GAMES FOUND.");
            renderSection('row-download', downloadGames, "NO DOWNLOADABLE GAMES FOUND.");

            const recents = recentGames.map(id => MY_ITCH_GAMES.find(g => g.id === id)).filter(Boolean);
            renderSection('row-recent', recents, "NO RECENTLY VIEWED GAMES.");

            const favs = favoriteGames.map(id => MY_ITCH_GAMES.find(g => g.id === id)).filter(Boolean);
            renderSection('row-fav', favs, "YOU HAVEN'T FAVORITED ANY GAMES YET.");

            // Automatically trigger lazy-loading of any missing thumbnails
            updateMissingThumbnails();
        }

        document.getElementById('search-input').addEventListener('input', (e) => {
            const term = e.target.value.toLowerCase();
            const searchWrapper = document.getElementById('search-results-wrapper');
            const defaultSections = document.getElementById('default-sections');

            // If user is typing a query, immediately redirect them to the home/games page view
            if (term.trim() !== "") {
                switchView('home');
            }

            if (term.trim() === "") {
                searchWrapper.classList.add('hidden');
                defaultSections.classList.remove('hidden');
                return;
            }

            searchWrapper.classList.remove('hidden');
            defaultSections.classList.add('hidden');

            const filtered = MY_ITCH_GAMES.filter(g => g.title.toLowerCase().includes(term) || g.tag.toLowerCase().includes(term));
            renderSection('row-search', filtered, "NO MATCHING GAMES FOUND.");

            // Trigger thumbnail scrapers for search results
            updateMissingThumbnails();
        });

        function toggleFavorite(id, event) {
            event.stopPropagation(); // Prevent opening modal
            if (favoriteGames.includes(id)) {
                favoriteGames = favoriteGames.filter(f => f !== id);
            } else {
                favoriteGames.push(id);
            }
            saveState('favorites', favoriteGames);
            renderAll(); // Re-render to update UI
        }
        // #endregion
    


        // #region 6. GAME LAUNCH & MODAL
        /*
        ################################################################################
        ################################################################################
        #                                                                              #
        #                6.  G A M E   L A U N C H   &   M O D A L                     #
        #                                                                              #
        ################################################################################
        ################################################################################
        */
        function handleGameClick(gameId) {
            const game = MY_ITCH_GAMES.find(g => g.id === gameId);
            if (!game) return;
            activeGame = game;

            // Update Recents
            recentGames = recentGames.filter(id => id !== gameId); // remove existing
            recentGames.unshift(gameId); // add to front
            if (recentGames.length > 10) recentGames.pop(); // limit
            saveState('recents', recentGames);
            renderAll();

            if (game.type === 'webgl') {
                const warningEl = document.getElementById('mobile-game-warning');
                if (warningEl) {
                    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
                    warningEl.style.display = isMobile ? 'block' : 'none';
                }

                document.getElementById('modal-game-title').innerText = ">> ENGINE RUNNING: " + game.title;

                // Set loading state inside the container and fade iframe in when loaded robustly (using inline onload)
                document.getElementById('modal-iframe-container').innerHTML = `
                <div id="iframe-loader">
                    <i class="fa-solid fa-spinner fa-spin" style="font-size: 20px;"></i>
                    <span>BOOTING ENGINE...</span>
                </div>
                <iframe src="${game.embedUrl}" onload="const loader=document.getElementById('iframe-loader'); if(loader)loader.remove(); this.style.opacity='1'; this.focus();" allow="autoplay; gamepad; keyboard; focus; fullscreen; accelerometer; gyroscope; magnetometer; pointer-lock" allowfullscreen="true" scrolling="no" frameborder="0" style="opacity: 0; width: 100%; height: 100%; border: none; transition: opacity 0.3s;"></iframe>
            `;

                document.getElementById('game-modal').classList.add('active');
                document.body.style.overflow = 'hidden';
            } else {
                // It's a download game, open itch.io page directly
                window.open(game.pageUrl, '_blank');
            }
        }

        function closeModal() {
            document.getElementById('game-modal').classList.remove('active');
            document.getElementById('modal-iframe-container').innerHTML = '';
            document.body.style.overflow = 'auto';
            activeGame = null;
        }

        function toggleIframeFullscreen() {
            const iframe = document.querySelector('#modal-iframe-container iframe');
            if (!iframe) return;

            if (iframe.requestFullscreen) {
                iframe.requestFullscreen();
            } else if (iframe.webkitRequestFullscreen) {
                iframe.webkitRequestFullscreen(); // Safari
            } else if (iframe.msRequestFullscreen) {
                iframe.msRequestFullscreen(); // IE11
            }
        }

        function openActiveGame() {
            if (!activeGame) return;
            const targetUrl = activeGame.pageUrl || activeGame.embedUrl;
            if (targetUrl) {
                window.open(targetUrl, '_blank');
            }
        }

        function switchView(view) {
            document.getElementById('view-home').classList.add('hidden');
            document.getElementById('view-settings').classList.add('hidden');
            const aboutView = document.getElementById('view-about');
            if (aboutView) aboutView.classList.add('hidden');
            document.querySelectorAll('.sidebar a').forEach(a => a.classList.remove('active'));

            if (view === 'home') {
                document.getElementById('view-home').classList.remove('hidden');
                document.getElementById('nav-home').classList.add('active');
            } else if (view === 'settings') {
                document.getElementById('view-settings').classList.remove('hidden');
                document.getElementById('nav-settings').classList.add('active');
            } else if (view === 'about') {
                if (aboutView) aboutView.classList.remove('hidden');
                const navAbout = document.getElementById('nav-about');
                if (navAbout) navAbout.classList.add('active');
            }

            // Close mobile sidebar
            document.querySelector('.sidebar').classList.remove('mobile-open');
        }

        function scrollToSection(id) {
            switchView('home');
            setTimeout(() => {
                document.getElementById(id).scrollIntoView({ behavior: 'smooth', block: 'start' });
                document.getElementById('nav-' + id.split('-')[1]).classList.add('active');
                document.getElementById('nav-home').classList.remove('active');
            }, 100);
        }
        // #endregion
    


        // #region 7. THEME & COLOR SYSTEMS
        /*
        ################################################################################
        ################################################################################
        #                                                                              #
        #                7.  T H E M E   &   C O L O R   S Y S T E M S                 #
        #                                                                              #
        ################################################################################
        ################################################################################
        */
        function hexToRgb(hex) {
            let r = parseInt(hex.slice(1, 3), 16), g = parseInt(hex.slice(3, 5), 16), b = parseInt(hex.slice(5, 7), 16);
            return `${r}, ${g}, ${b}`;
        }

        function hexToHsl(hex) {
            hex = hex.replace(/^#/, '');
            let r = parseInt(hex.substring(0, 2), 16) / 255;
            let g = parseInt(hex.substring(2, 4), 16) / 255;
            let b = parseInt(hex.substring(4, 6), 16) / 255;
            let max = Math.max(r, g, b), min = Math.min(r, g, b);
            let h, s, l = (max + min) / 2;
            if (max === min) {
                h = s = 0;
            } else {
                let d = max - min;
                s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
                switch (max) {
                    case r: h = (g - b) / d + (g < b ? 6 : 0); break;
                    case g: h = (b - r) / d + 2; break;
                    case b: h = (r - g) / d + 4; break;
                }
                h /= 6;
            }
            return {
                h: Math.round(h * 360),
                s: Math.round(s * 100),
                l: Math.round(l * 100)
            };
        }

        function setThemeColor(hex, element, isInit = false) {
            // If theme is changed manually, disable RGB mode
            const rgbToggle = document.getElementById('toggle-rgb');
            if (rgbToggle && rgbToggle.classList.contains('active') && !isInit) {
                rgbToggle.classList.remove('active');
                toggleRGBMode(false);
                saveState('rgbMode', false);
                const speedContainer = document.getElementById('rgb-speed-container');
                if (speedContainer) speedContainer.style.display = 'none';
            }

            document.documentElement.style.setProperty('--main-color', hex);

            // Calculate new glow based on the rgb value
            const rgb = hexToRgb(hex);
            document.documentElement.style.setProperty('--neon-glow', `0 0 8px rgba(${rgb}, 0.6)`);
            document.documentElement.style.setProperty('--bg-glow', `rgba(${rgb}, 0.15)`);

            // Set HSL variables for dynamic background effects
            const hsl = hexToHsl(hex);
            document.documentElement.style.setProperty('--theme-h', hsl.h);
            document.documentElement.style.setProperty('--theme-s', hsl.s + '%');
            document.documentElement.style.setProperty('--theme-l', hsl.l + '%');

            // Update 3D particles if available
            if (window.updateThreeParticlesColor) {
                window.updateThreeParticlesColor(hex);
            }

            // Update UI swatches
            document.querySelectorAll('.color-swatch').forEach(sw => sw.classList.remove('active'));
            const customPickerBtn = document.getElementById('custom-color-picker-btn');
            if (customPickerBtn) customPickerBtn.classList.remove('active');

            if (element) {
                element.classList.add('active');
            } else if (isInit) {
                // Find and highlight correct swatch on load
                let foundSwatch = false;
                document.querySelectorAll('.color-swatch').forEach(sw => {
                    if (sw.style.backgroundColor === hex || sw.style.backgroundColor === `rgb(${rgb})`) {
                        sw.classList.add('active');
                        foundSwatch = true;
                    }
                });
                if (!foundSwatch && customPickerBtn) {
                    customPickerBtn.classList.add('active');
                    const pickerInput = document.getElementById('custom-color-picker');
                    if (pickerInput) pickerInput.value = hex;
                }
            } else {
                // Custom picker was used
                if (customPickerBtn) {
                    customPickerBtn.classList.add('active');
                    const pickerInput = document.getElementById('custom-color-picker');
                    if (pickerInput) pickerInput.value = hex;
                }
            }
            saveState('themeColor', hex);
        }

        function toggleVFX(type) {
            vfxConfig[type] = !vfxConfig[type];

            const toggleBtn = document.getElementById(`toggle-${type}`);
            if (vfxConfig[type]) toggleBtn.classList.add('active');
            else toggleBtn.classList.remove('active');

            // Apply immediately to background DOM elements
            if (type === 'stars') document.getElementById('stars-bg').style.display = vfxConfig.stars ? 'block' : 'none';
            if (type === 'drift') document.getElementById('drift-stars-bg').style.display = vfxConfig.drift ? 'block' : 'none';
            if (type === 'particles') document.getElementById('particles').style.display = vfxConfig.particles ? 'block' : 'none';

            saveState('vfxConfig', vfxConfig);
        }

        function applyInitialSettings() {
            Object.keys(vfxConfig).forEach(key => {
                const toggleBtn = document.getElementById(`toggle-${key}`);
                if (toggleBtn) {
                    if (vfxConfig[key]) toggleBtn.classList.add('active');
                    else toggleBtn.classList.remove('active');
                }
            });
            document.getElementById('stars-bg').style.display = vfxConfig.stars ? 'block' : 'none';
            const driftEl = document.getElementById('drift-stars-bg');
            if (driftEl) driftEl.style.display = vfxConfig.drift ? 'block' : 'none';
            document.getElementById('particles').style.display = vfxConfig.particles ? 'block' : 'none';
        }

        function saveState(key, data) {
            Storage.save(key, data);
        }
        // #endregion
    


        // #region 8. VFX EFFECTS SETUP
        /*
        ################################################################################
        ################################################################################
        #                                                                              #
        #                     8.  V F X   E F F E C T S   S E T U P                    #
        #                                                                              #
        ################################################################################
        ################################################################################
        */
        function initEffects() {
            // Generate Stars
            const starsContainer = document.getElementById('stars-bg');
            for (let i = 0; i < CONFIG.vfx.starCount; i++) {
                const star = document.createElement('div');
                star.className = 'star';
                const size = Math.random() * 2.5 + 0.5;
                star.style.cssText = `width: ${size}px; height: ${size}px; left: ${Math.random() * 100}vw; top: ${Math.random() * 100}vh; --a: ${Math.random() * 0.5 + 0.1}; --d: ${Math.random() * 3 + 2}s; animation-delay: ${Math.random() * 4}s;`;
                starsContainer.appendChild(star);
            }

            // Generate Floating Particles
            const particlesContainer = document.getElementById('particles');
            for (let i = 0; i < CONFIG.vfx.particleCount; i++) {
                const particle = document.createElement('div');
                particle.className = 'ender-particle';
                particle.style.cssText = `left: ${Math.random() * 100}vw; top: ${Math.random() * 100}vh; animation-delay: ${Math.random() * 5}s; animation-duration: ${3 + Math.random() * 4}s;`;
                particlesContainer.appendChild(particle);
            }

            // Cursor Trail
            let lastTrail = 0;
            document.addEventListener('mousemove', e => {
                if (!vfxConfig.trail) return;
                const now = Date.now();
                if (now - lastTrail < 60) return;
                lastTrail = now;
                const trail = document.createElement('div');
                trail.style.cssText = `position:fixed; pointer-events:none; z-index:999; width:4px; height:4px; background:var(--main-color); left:${e.clientX}px; top:${e.clientY}px; transition:opacity 0.4s; box-shadow: var(--neon-glow);`;
                document.body.appendChild(trail);
                setTimeout(() => { trail.style.opacity = '0'; }, 50);
                setTimeout(() => trail.remove(), 450);
            });

            // Burst on click
            document.addEventListener('click', e => {
                if (!vfxConfig.burst) return;
                if (e.target.closest('.close-btn') || e.target.closest('.toggle-switch') || e.target.closest('.modal-btn')) return;

                for (let i = 0; i < CONFIG.vfx.burstCount; i++) {
                    const p = document.createElement('div');
                    p.className = 'burst-particle';
                    const angle = (Math.random() * 360) * Math.PI / 180;
                    const dist = Math.random() * 80 + 30;
                    p.style.cssText = `left: ${e.clientX}px; top: ${e.clientY}px; --px: ${Math.cos(angle) * dist}px; --py: ${Math.sin(angle) * dist}px; background: var(--main-color); box-shadow: 0 0 8px var(--main-color);`;
                    document.body.appendChild(p);
                    setTimeout(() => p.remove(), 1400);
                }
            });

            // Close mobile sidebar on click outside
            document.addEventListener('click', e => {
                const sidebar = document.querySelector('.sidebar');
                const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
                if (sidebar && sidebar.classList.contains('mobile-open')) {
                    if (!sidebar.contains(e.target) && !e.target.closest('.mobile-menu-btn')) {
                        sidebar.classList.remove('mobile-open');
                    }
                }
            });
        }
        // #endregion
    


        // #region 9. RGB SPECTRUM MODE
        /*
        ################################################################################
        ################################################################################
        #                                                                              #
        #                   9.  R G B   S P E C T R U M   M O D E                      #
        #                                                                              #
        ################################################################################
        ################################################################################
        */
        let rgbIntervalId = null;
        let currentHue = 0;
        let rgbSpeed = CONFIG.rgbMode.defaultSpeed; // Hue degrees increment per frame

        function toggleRGBMode(active) {
            if (active) {
                if (rgbIntervalId) clearInterval(rgbIntervalId);
                rgbIntervalId = setInterval(() => {
                    // Increment hue dynamically by current speed
                    currentHue = (currentHue + rgbSpeed) % 360;

                    // Addressable Zone 1: Main color accents (headings, card borders)
                    const color1 = `hsl(${currentHue}, 100%, 50%)`;
                    const glow1 = `0 0 8px hsl(${currentHue}, 100%, 50%, 0.6)`;

                    // Addressable Zone 2: Secondary accents (sidebar hovered/active text, icons, stats)
                    const hue2 = (currentHue + CONFIG.rgbMode.offsets.zone2) % 360;
                    const color2 = `hsl(${hue2}, 100%, 50%)`;
                    const glow2 = `0 0 8px hsl(${hue2}, 100%, 50%, 0.6)`;

                    // Addressable Zone 3: Enderman eyes (complementary spectrum)
                    const hue3 = (currentHue + CONFIG.rgbMode.offsets.zone3) % 360;
                    const color3 = `hsl(${hue3}, 100%, 50%)`;

                    // Addressable Zone 4: Void background glow
                    const hue4 = (currentHue + CONFIG.rgbMode.offsets.zone4) % 360;
                    const bgGlowHsl = `hsl(${hue4}, 100%, 50%, 0.15)`;

                    document.documentElement.style.setProperty('--main-color', color1);
                    document.documentElement.style.setProperty('--neon-glow', glow1);

                    document.documentElement.style.setProperty('--secondary-color', color2);
                    document.documentElement.style.setProperty('--secondary-glow', glow2);

                    document.documentElement.style.setProperty('--eye-color', color3);
                    document.documentElement.style.setProperty('--bg-glow', bgGlowHsl);

                    // Update drift stars variables to match RGB rainbow spectrum cycle
                    document.documentElement.style.setProperty('--theme-h', currentHue);
                    document.documentElement.style.setProperty('--theme-s', '100%');
                    document.documentElement.style.setProperty('--theme-l', '50%');
                }, CONFIG.rgbMode.intervalMs);
            } else {
                if (rgbIntervalId) {
                    clearInterval(rgbIntervalId);
                    rgbIntervalId = null;
                }
                // Remove secondary/shifted variables so static colors function correctly
                document.documentElement.style.removeProperty('--secondary-color');
                document.documentElement.style.removeProperty('--secondary-glow');
                document.documentElement.style.removeProperty('--eye-color');
            }
        }

        function toggleRGBClick() {
            const toggleBtn = document.getElementById('toggle-rgb');
            const active = !toggleBtn.classList.contains('active');
            if (active) {
                toggleBtn.classList.add('active');
            } else {
                toggleBtn.classList.remove('active');
            }
            toggleRGBMode(active);
            saveState('rgbMode', active);

            // Show/hide speed slider dynamically
            const speedContainer = document.getElementById('rgb-speed-container');
            if (speedContainer) {
                speedContainer.style.display = active ? 'flex' : 'none';
            }
        }

        function updateRGBSpeed(val) {
            rgbSpeed = parseInt(val);
            saveState('rgbSpeed', val);
        }

        function initPortalStars() {
            const portalVoid = document.getElementById('end-portal-void');
            if (portalVoid) {
                // Clear any existing stars
                portalVoid.querySelectorAll('.portal-star').forEach(el => el.remove());
                for (let i = 0; i < 75; i++) {
                    const ps = document.createElement('div');
                    ps.className = 'portal-star';
                    ps.style.left = Math.random() * 100 + '%';
                    ps.style.top = Math.random() * 100 + '%';
                    const colors = ['#ff007f', '#00d4ff', '#ffffff', '#7b2fbe', '#9955ff'];
                    ps.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
                    const size = Math.random() * 3 + 1;
                    ps.style.width = size + 'px';
                    ps.style.height = size + 'px';
                    ps.style.animationDuration = (Math.random() * 4 + 3) + 's';
                    ps.style.animationDelay = (Math.random() * 4) + 's';
                    const driftX = (Math.random() * 40 - 20) + 'px';
                    const driftY = (Math.random() * 40 - 20) + 'px';
                    ps.style.setProperty('--dx', driftX);
                    ps.style.setProperty('--dy', driftY);

                    portalVoid.appendChild(ps);
                }
            }
        }

        function initDriftStars() {
            const container = document.getElementById('drift-stars-bg');
            if (container) {
                // Clear any existing stars
                container.querySelectorAll('.drift-star').forEach(el => el.remove());
                for (let i = 0; i < 120; i++) {
                    const star = document.createElement('div');
                    star.className = 'drift-star';
                    star.style.left = Math.random() * 100 + 'vw';
                    star.style.top = Math.random() * 100 + 'vh';

                    // Recreate the original color distribution relative to the selected theme:
                    // 1. Theme Color (original: #ff007f magenta)
                    // 2. Complementary Accent (original: #00d4ff cyan, approx +220 deg)
                    // 3. White (original: #ffffff, 0% sat, 100% light)
                    // 4. Deep Purple shift (original: #7b2fbe, approx -58 deg)
                    // 5. Light Purple shift (original: #9955ff, approx -66 deg, +16% light)
                    const type = Math.floor(Math.random() * 5);
                    if (type === 0) {
                        // Type 1: Theme Color (no offsets)
                        star.style.setProperty('--h-offset', 0);
                        star.style.setProperty('--s-offset', '0%');
                        star.style.setProperty('--l-offset', '0%');
                    } else if (type === 1) {
                        // Type 2: Complementary Accent
                        star.style.setProperty('--h-offset', 220);
                        star.style.setProperty('--s-offset', '0%');
                        star.style.setProperty('--l-offset', '0%');
                    } else if (type === 2) {
                        // Type 3: White
                        star.style.setProperty('--h-offset', 0);
                        star.style.setProperty('--s-override', '0%');
                        star.style.setProperty('--l-override', '100%');
                    } else if (type === 3) {
                        // Type 4: Deep Hue Shift (-58 deg)
                        star.style.setProperty('--h-offset', -58);
                        star.style.setProperty('--s-offset', '-40%');
                        star.style.setProperty('--l-offset', '-4%');
                    } else if (type === 4) {
                        // Type 5: Light Hue Shift (-66 deg)
                        star.style.setProperty('--h-offset', -66);
                        star.style.setProperty('--s-offset', '0%');
                        star.style.setProperty('--l-offset', '16%');
                    }

                    const size = Math.random() * 3 + 1.5;
                    star.style.width = size + 'px';
                    star.style.height = size + 'px';

                    star.style.animationDuration = (Math.random() * 5 + 4) + 's';
                    star.style.animationDelay = (Math.random() * 5) + 's';

                    const driftX = (Math.random() * 300 - 150) + 'px';
                    const driftY = (Math.random() * 300 - 150) + 'px';
                    star.style.setProperty('--dx', driftX);
                    star.style.setProperty('--dy', driftY);

                    container.appendChild(star);
                }
            }
        }

        // Initialize on load
        window.onload = () => {
            applyInitialSettings();

            // Load RGB Mode if enabled
            const rgbToggle = document.getElementById('toggle-rgb');
            try {
                const savedRGB = Storage.load('rgbMode');
                if (savedRGB && JSON.parse(savedRGB)) {
                    if (rgbToggle) rgbToggle.classList.add('active');

                    // Show speed slider container
                    const speedContainer = document.getElementById('rgb-speed-container');
                    if (speedContainer) speedContainer.style.display = 'flex';

                    // Load saved speed
                    const savedSpeed = Storage.load('rgbSpeed');
                    if (savedSpeed) {
                        rgbSpeed = parseInt(savedSpeed);
                        const slider = document.getElementById('rgb-speed-slider');
                        if (slider) slider.value = savedSpeed;
                    }

                    toggleRGBMode(true);
                }
            } catch (e) { }

            renderAll();
            initEffects();
            initPortalStars();
            initDriftStars();
        };
        // #endregion// Three.js 3D Background Setup
