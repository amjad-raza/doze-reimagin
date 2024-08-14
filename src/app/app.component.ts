import { AfterViewInit, Component, ElementRef, HostListener, ViewChild } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import Lenis from 'lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
gsap.registerPlugin(ScrollTrigger);

interface Frame {
  currentIndex: number;
  maxIndex: number;
}

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements AfterViewInit {
  title = 'doze-reimagin';
  lenis: any;
  @ViewChild('frame') canvas!: ElementRef<HTMLCanvasElement>;
  private context!: CanvasRenderingContext2D | null;

  frames: Frame = {
    currentIndex: 0,
    // maxIndex: 538,
    maxIndex: 1345,
  };

  private images: HTMLImageElement[] = [];
  imagesLoaded = 0;
  private resizeTimeout!: any;

  ngOnInit(): void {
    this.lenis = new Lenis({
      duration: 1.2,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      // smooth: true, // Remove this line if it causes errors
    });

    const raf = (time: number) => {
      this.lenis.raf(time);
      requestAnimationFrame(raf);
    };

    requestAnimationFrame(raf);
  }

  ngAfterViewInit() {
    this.context = this.canvas.nativeElement.getContext('2d');
    this.disableScroll(); // Disable scrolling initially
    this.preloadImages();
    this.handleResize();
    document.querySelectorAll(".headings h3").forEach((heading) => {
      gsap.from(heading, {
        scrollTrigger: {
          trigger: heading,
          start: "top 80%",
          end: "bottom 20%",
          scrub: 2
        },
        opacity: .3
      })
    })
  }

  disableScroll() {
    document.body.style.overflow = 'hidden';
  }

  enableScroll() {
    document.body.style.overflow = 'auto';
  }

  preloadImages() {
    for (let i = 1; i <= this.frames.maxIndex; i++) {
      const imageUrl = `../assets/doze/frame_${i.toString().padStart(4, '0')}.jpeg`;
      const img = new Image();
      img.src = imageUrl;
      img.onload = () => {
        this.imagesLoaded++;
        if (this.imagesLoaded === this.frames.maxIndex) {
          this.loadImage(this.frames.currentIndex);
          this.enableScroll(); // Re-enable scrolling once all images are loaded
          this.startAnimation();
        }
      };
      this.images.push(img);
    }
  }

  loadImage(index: number) {
    if (index >= 0 && index <= this.frames.maxIndex && this.context) {
      const img = this.images[index];
      const canvasElement = this.canvas.nativeElement;

      const scale = Math.max(canvasElement.width / img.width, canvasElement.height / img.height);
      const newWidth = img.width * scale;
      const newHeight = img.height * scale;
      const offsetX = (canvasElement.width - newWidth) / 2;
      const offsetY = (canvasElement.height - newHeight) / 2;

      this.context.clearRect(0, 0, canvasElement.width, canvasElement.height);
      this.context.imageSmoothingEnabled = true;
      this.context.imageSmoothingQuality = 'high';
      this.context.drawImage(img, offsetX, offsetY, newWidth, newHeight);

      this.frames.currentIndex = index;
    }
  }

  startAnimation() {
    var tl = gsap.timeline({
      scrollTrigger: {
        trigger: '.parent',
        start: 'top top',
        scrub: 2,
        // markers: true,
      },
    })

    tl
      .to(this.frames, this.updateFrames(80), 'anime1-strta')
      .to('.anime1', { opacity: 0, ease: 'linear' }, 'anime1-strta')

      .to(this.frames, this.updateFrames(160), 'anime2-strta')
      .to('.anime2', { opacity: 1, ease: 'linear' }, 'anime2-strta')
      .to(this.frames, this.updateFrames(240), 'anime2-stay')
      .to('.anime2', { opacity: 1, ease: 'linear' }, 'anime2-stay')
      .to(this.frames, this.updateFrames(400), 'anime2-end')
      .to('.anime2', { opacity: 0, ease: 'linear' }, 'anime2-end')

      .to(this.frames, this.updateFrames(480), 'anime3-strta')
      .to('.anime3', { opacity: 1, ease: 'linear' }, 'anime3-strta')
      .to(this.frames, this.updateFrames(560), 'anime3-stay')
      .to('.anime3', { opacity: 1, ease: 'linear' }, 'anime3-stay')
      .to(this.frames, this.updateFrames(640), 'anime3-end')
      .to('.anime3', { opacity: 0, ease: 'linear' }, 'anime3-end')

      .to(this.frames, this.updateFrames(720), 'panel-strat')
      .to('.panel', { translateX: 0, ease: 'expo' }, 'panel-start')
      .to(this.frames, this.updateFrames(800), 'panel-stay')
      .to('.panel', { translateX: 0, ease: 'expo' }, 'panel-stay')
      .to(this.frames, this.updateFrames(880), 'panel-end')
      .to('.panel', { opacity: 0, ease: 'linear' }, 'panel-end')

      .to(this.frames, this.updateFrames(960), 'canvas-strat')
      .to('canvas', { scale: 0.5, ease: 'linear' }, 'canvas-start')

      .to(this.frames, this.updateFrames(1040), 'panelism-strat')
      .to('.panelism', { opacity: 1, ease: 'expo' }, 'panelism-start')
      .to(this.frames, this.updateFrames(1120), 'panelism-strat')
      .to('.panelism span', { width: 200, ease: 'expo' }, 'panelism-start')

      .to(this.frames, this.updateFrames(1200), 'canvas-end')
      .to('canvas', { scale: 1, ease: 'linear' }, 'canvas-end')

      .to(this.frames, this.updateFrames(1280), 'panelism-scale')
      .to('.panelism', { scale: 2, ease: 'circ' }, 'panelism-scale')
      .to(this.frames, this.updateFrames(1345), 'panelism-stay')
      .to('.panelism', { scale: 2, ease: 'circ' }, 'panelism-stay')
  }

  updateFrames(index: number) {
    return {
      currentIndex: index,
      duration: 1,
      ease: 'linear',
      onUpdate: () => {
        requestAnimationFrame(() => {
          this.loadImage(Math.floor(this.frames.currentIndex));
        });
      },
    }
  }

  @HostListener('window:resize')
  onResize() {
    clearTimeout(this.resizeTimeout);
    this.resizeTimeout = setTimeout(() => this.handleResize(), 200);
  }

  handleResize() {
    const canvasElement = this.canvas.nativeElement;
    canvasElement.width = window.innerWidth;
    canvasElement.height = window.innerHeight;
    this.loadImage(this.frames.currentIndex);
  }

  get loadingPercentage(): number {
    return Math.floor((this.imagesLoaded / this.frames.maxIndex) * 100);
  }
}
