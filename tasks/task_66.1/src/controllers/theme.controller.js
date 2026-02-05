function setTheme(req, res) {
  const theme = String(req.query.theme || '').toLowerCase()

  if (theme !== 'dark' && theme !== 'light') {
    return res.status(400).type('text').send('Invalid theme. Use dark or light.')
  }

  res.cookie('theme', theme, {
    httpOnly: false,
    sameSite: 'lax',
    maxAge: 30 * 24 * 60 * 60 * 1000
  })

  const back = req.get('referer') || '/'
  res.redirect(back)
}

module.exports = { setTheme }