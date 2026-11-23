(() => {
  const toggle = document.querySelector('.menu-toggle');
  const nav = document.querySelector('.main-nav');
  const header = document.querySelector('.site-header');
  if (header) {
    const updateHeader = () => header.classList.toggle('is-scrolled', window.scrollY > 24);
    updateHeader();
    window.addEventListener('scroll', updateHeader, { passive: true });
  }
  if (toggle && nav) {
    const closeNav = () => { toggle.setAttribute('aria-expanded', 'false'); toggle.setAttribute('aria-label', 'Open navigation'); nav.classList.remove('is-open'); };
    toggle.addEventListener('click', () => {
      const open = toggle.getAttribute('aria-expanded') !== 'true';
      toggle.setAttribute('aria-expanded', String(open));
      toggle.setAttribute('aria-label', open ? 'Close navigation' : 'Open navigation');
      nav.classList.toggle('is-open', open);
    });
    nav.querySelectorAll('a').forEach((link) => link.addEventListener('click', closeNav));
    document.addEventListener('keydown', (event) => { if (event.key === 'Escape') closeNav(); });
  }

  const menus = {
    dinner: [
      { title: 'A beginning', image: 'https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=1000&q=85', imageAlt: 'Seasonal garden vegetables plated with herbs', imageCaption: 'Garden vegetables · buttermilk · lovage', dishes: [['Warm sourdough', 'cultured butter · smoked salt', '8'], ['Market vegetables', 'buttermilk · lovage · toasted seed', '18'], ['Hand-dived scallop', 'green apple · sea herbs · brown butter', '24'], ['Cured duck', 'pear · chicory · black walnut', '21']] },
      { title: 'A little more', image: 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?auto=format&fit=crop&w=1000&q=85', imageAlt: 'Line-caught fish with a bright seasonal garnish', imageCaption: 'Line-caught turbot · fennel · champagne sauce', dishes: [['Line-caught turbot', 'fennel · mussel · champagne sauce', '38'], ['Aged beef for two', 'wild mushroom · potato · pepper jus', '78'], ['Roasted pumpkin', 'chestnut · sage · winter truffle', '29'], ['Rhubarb & vanilla', 'toasted oat · crème fraîche', '15']] }
    ],
    tasting: [
      { title: 'The season, in six chapters', image: 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?auto=format&fit=crop&w=1000&q=85', imageAlt: 'A seasonal seafood course finished with herbs', imageCaption: 'The shore · scallop · green apple · sea herbs', dishes: [['01 · The first bite', 'A small welcome from the kitchen', ''], ['02 · Gathered', 'Garden leaves · fermented plum · sorrel', ''], ['03 · The shore', 'Scallop · green apple · sea herbs', ''], ['04 · The water', 'Turbot · fennel · champagne sauce', ''], ['05 · The field', 'Aged beef · wild mushroom · pepper jus', ''], ['06 · The sweet finish', 'Rhubarb · vanilla · toasted oat', ''], ['Six courses', 'Optional wine pairing · £85 per person', '95']] },
      { title: 'To make it yours', image: 'https://images.unsplash.com/photo-1488477181946-6428a0291777?auto=format&fit=crop&w=1000&q=85', imageAlt: 'An elegant seasonal dessert with berries', imageCaption: 'Seasonal pairing · six carefully chosen glasses', dishes: [['Vegetarian menu', 'A thoughtful seasonal alternative, prepared with notice', '82'], ['Wine pairing', 'Six carefully chosen glasses from our cellar', '68'], ['Alcohol-free pairing', 'Small-batch ferments, teas and orchard fruit', '45']] }
    ],
    wine: [
      { title: 'A few cellar notes', image: '/images/menu-cellar-pour.png', imageAlt: 'A glass of champagne poured beside a dark wine bottle', imageCaption: 'Grower champagne · France · NV', dishes: [['Champagne · Pierre Gimonnet', 'Cuis 1er Cru · France · NV', '19'], ['Chenin Blanc · Domaine Huet', 'Vouvray Sec · Loire · 2022', '22'], ['Chardonnay · Domaine Leflaive', 'Mâcon-Verzé · Burgundy · 2021', '28'], ['Pinot Noir · Enderle & Moll', 'Baden · Germany · 2020', '25'], ['Syrah · Domaine Jamet', 'Collines Rhodaniennes · 2021', '31']] },
      { title: 'By the glass', image: '/images/menu-wine-pairing.png', imageAlt: 'Red and white wine glasses on a candlelit table', imageCaption: 'By the glass · chosen for the season', dishes: [['Aperitif', 'Seasonal house spritz · vermouth · soda', '16'], ['Something bright', 'Three rotating pours from the cellar', '34'], ['The sommelier’s choice', 'A bottle to follow the evening', 'Market']] }
    ]
  };
  const menuContainer = document.querySelector('#menu-content');
  if (menuContainer) {
    const renderMenu = (category) => {
      const data = menus[category];
      menuContainer.innerHTML = `<div class="menu-columns">${data.map((group) => `<section class="menu-group">${group.image ? `<figure class="menu-feature"><img src="${group.image}" alt="${group.imageAlt}" loading="lazy"><figcaption>${group.imageCaption}</figcaption></figure>` : ''}<h2 class="menu-category-title">${group.title}</h2>${group.dishes.map(([name, description, price]) => `<article class="menu-entry"><div class="menu-entry-top"><h3>${name}</h3>${price ? `<span class="price">${price === 'Market' ? price : `£${price}`}</span>` : ''}</div><p>${description}</p></article>`).join('')}</section>`).join('')}</div>`;
    };
    const categoryButtons = [...document.querySelectorAll('.category-button')];
    const activateCategory = (button) => {
      categoryButtons.forEach((item) => {
        const active = item === button;
        item.classList.toggle('active', active);
        item.setAttribute('aria-selected', String(active));
        item.tabIndex = active ? 0 : -1;
      });
      renderMenu(button.dataset.category);
      menuContainer.setAttribute('aria-labelledby', button.id);
    };
    categoryButtons.forEach((button, index) => {
      button.addEventListener('click', () => activateCategory(button));
      button.addEventListener('keydown', (event) => {
        let nextIndex = index;
        if (event.key === 'ArrowRight') nextIndex = (index + 1) % categoryButtons.length;
        else if (event.key === 'ArrowLeft') nextIndex = (index - 1 + categoryButtons.length) % categoryButtons.length;
        else if (event.key === 'Home') nextIndex = 0;
        else if (event.key === 'End') nextIndex = categoryButtons.length - 1;
        else return;
        event.preventDefault();
        categoryButtons[nextIndex].focus();
        activateCategory(categoryButtons[nextIndex]);
      });
    });
    renderMenu('dinner');
  }

  const lightbox = document.querySelector('.lightbox');
  if (lightbox) {
    const image = lightbox.querySelector('img');
    document.querySelectorAll('.gallery-item').forEach((item) => item.addEventListener('click', () => {
      image.src = item.dataset.full;
      image.alt = item.querySelector('img').alt;
      lightbox.showModal();
    }));
    lightbox.querySelector('.lightbox-close').addEventListener('click', () => lightbox.close());
    lightbox.addEventListener('click', (event) => { if (event.target === lightbox) lightbox.close(); });
  }

  const form = document.querySelector('#reservation');
  if (form) {
    const dateInput = form.querySelector('input[type="date"]');
    const today = new Date();
    const localToday = new Date(today.getTime() - today.getTimezoneOffset() * 60000).toISOString().slice(0, 10);
    dateInput.min = localToday;
    form.addEventListener('submit', (event) => {
      event.preventDefault();
      const message = form.querySelector('.form-message');
      message.classList.remove('error');
      if (!form.reportValidity()) {
        message.textContent = 'Please check the highlighted fields and try again.';
        message.classList.add('error');
        return;
      }
      message.textContent = 'Thank you. Your request is ready — please email hello@noir.example to confirm your reservation.';
      form.reset();
      dateInput.min = localToday;
    });
  }

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (!reduceMotion && 'IntersectionObserver' in window) {
    const revealTargets = document.querySelectorAll(
      '.intro-side, .intro-main, .intro-image, .section-heading, .dish-card, .dish-photo, .table-experience-heading, .table-experience-copy, .quote-band blockquote, .quote-credit, .visit-strip > *, .page-hero-content, .page-index, .story-aside, .story-copy, .values article, .chef-feature > img, .chef-feature > div, .menu-page-intro > *, .menu-controls, .menu-feature, .menu-category-title, .menu-entry, .gallery-intro > *, .gallery-item, .contact-intro > *, .contact-details > *, .reservation-form > *, .contact-bottom > div, .site-footer > *'
    );
    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        entry.target.classList.toggle('is-visible', entry.isIntersecting);
      });
    }, { threshold: 0.14, rootMargin: '-8% 0px -8% 0px' });
    revealTargets.forEach((target, index) => {
      target.classList.add('scroll-reveal');
      target.dataset.reveal = ['up', 'left', 'right', 'scale'][index % 4];
      target.style.setProperty('--reveal-order', String(index % 4));
      revealObserver.observe(target);
    });
  }

})();
