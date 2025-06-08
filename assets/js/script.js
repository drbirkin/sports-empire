const player = videojs('my-video')
const customProgress = document.getElementById('custom-progress')
const customPlayProgress = document.getElementById('custom-play-progress')
const playHead = document.getElementById('play-head')

// 更新进度条函数
// function updateCustomProgress() {
//   if (customProgress) {
//     customProgress.style.display = 'inline-block'
//   }
//   const duration = player.duration()
//   if (duration > 0) {
//     const currentTime = player.currentTime()
//     // 将播放进度映射到后50%区域
//     const progressPercent = (currentTime / duration) * 50

//     customPlayProgress.style.width = `${progressPercent}%`
//     playHead.style.left = `${50 + progressPercent}%`
//   }
// }

// 点击事件处理
customProgress.addEventListener('click', (e) => {
  const rect = customProgress.getBoundingClientRect()
  const clickPos = (e.clientX - rect.left) / rect.width

  if (clickPos <= 0.5) {
    // 点击前50%区域：跳转到开始位置
    player.currentTime(0)
  } else {
    // 点击后50%区域：计算实际播放时间
    const seekPercent = (clickPos - 0.5) * 2 // 映射到0-100%
    player.currentTime(player.duration() * seekPercent)
  }
})

// 监听播放进度更新
let hasAnimated = false

player.ready(() => {
  if (customProgress) {
    customProgress.style.display = 'none'
  }
  playHead.style.left = '50%' // Initially center
})

player.on('play', () => {
  if (!hasAnimated) {
    hasAnimated = true
    player.pause() // Stop video until animation finishes

    // Show custom progress bar
    customProgress.style.display = 'inline-block'

    // Animate to 50%
    customPlayProgress.classList.add('animate-to-half')

    // After animation completes, remove class and start playing
    setTimeout(() => {
      customPlayProgress.classList.remove('animate-to-half')
      // 从50%开始播放
      customPlayProgress.style.left = '50%'
      player.play() // Resume actual video
    }, 1000) // Match animation duration
  }
})

// Progress updates (only once animation is over)
function updateCustomProgress() {
  if (!hasAnimated || player.paused()) return

  const duration = player.duration()
  if (duration > 0) {
    const currentTime = player.currentTime()
    const progressPercent = (currentTime / duration) * 50

    customPlayProgress.style.width = `${progressPercent}%`
    playHead.style.left = `${50 + progressPercent}%`
  }
}

player.on('timeupdate', updateCustomProgress)

// 初始化播放头位置
player.ready(() => {
  if (customProgress) {
    customProgress.style.display = 'none'
  }
  playHead.style.left = '50%'
})

