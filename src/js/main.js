(() => {
  const root = document.documentElement

  let rafMouse = null
  window.addEventListener('pointermove', e => {
    if (rafMouse) return
    rafMouse = requestAnimationFrame(() => {
      root.style.setProperty('--mx', `${e.clientX}px`)
      root.style.setProperty('--my', `${e.clientY}px`)
      rafMouse = null
    })
  }, { passive: true })

  const noHover = window.matchMedia('(hover: none)')

  document.querySelectorAll('.link-card').forEach(card => {
    let raf = null

    const move = e => {
      const r = card.getBoundingClientRect()
      const x = e.clientX - r.left
      const y = e.clientY - r.top
      const ry = ((x / r.width) - .5) * 10
      const rx = ((.5 - (y / r.height)) * 8)
      card.style.setProperty('--local-x', `${x}px`)
      card.style.setProperty('--local-y', `${y}px`)
      card.style.transform = `perspective(920px) rotateX(${rx.toFixed(2)}deg) rotateY(${ry.toFixed(2)}deg) translateY(-5px) scale(1.012)`
    }

    card.addEventListener('pointermove', e => {
      if (noHover.matches) return
      if (raf) cancelAnimationFrame(raf)
      raf = requestAnimationFrame(() => move(e))
    })

    card.addEventListener('pointerleave', () => {
      if (raf) cancelAnimationFrame(raf)
      card.style.transform = 'perspective(920px) rotateX(0deg) rotateY(0deg) translateY(0) scale(1)'
      setTimeout(() => { card.style.transform = '' }, 180)
    })
  })

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible')
        observer.unobserve(entry.target)
      }
    })
  }, { threshold: .12 })

  document.querySelectorAll('.reveal').forEach((el, i) => {
    el.style.transitionDelay = `${Math.min(i * 38, 220)}ms`
    observer.observe(el)
  })
})()
