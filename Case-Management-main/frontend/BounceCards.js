import { gsap } from 'gsap';

export default class BounceCards {
    constructor(containerElement, options = {}) {
        this.container = containerElement;
        this.className = options.className || '';
        this.contents = options.contents || [];
        this.containerWidth = options.containerWidth || 400;
        this.containerHeight = options.containerHeight || 400;
        this.animationDelay = options.animationDelay !== undefined ? options.animationDelay : 0.5;
        this.animationStagger = options.animationStagger !== undefined ? options.animationStagger : 0.06;
        this.easeType = options.easeType || 'elastic.out(1, 0.8)';
        this.transformStyles = options.transformStyles || [
            'rotate(10deg) translate(-170px)',
            'rotate(5deg) translate(-85px)',
            'rotate(-3deg)',
            'rotate(-10deg) translate(85px)',
            'rotate(2deg) translate(170px)'
        ];
        this.enableHover = options.enableHover !== undefined ? options.enableHover : true;
        this.pushAmount = options.pushAmount || 220; // Allow dynamic push amounts

        this.cards = [];
        this.init();
    }

    init() {
        this.container.classList.add('bounceCardsContainer');
        if (this.className) {
            this.container.classList.add(this.className);
        }

        this.container.style.position = 'relative';
        this.container.style.width = this.containerWidth + 'px';
        this.container.style.height = this.containerHeight + 'px';

        this.contents.forEach((htmlContent, idx) => {
            const card = document.createElement('div');
            // info-card class allows it to borrow styling from index.html
            card.className = `card info-card card-${idx}`;
            card.style.transform = this.transformStyles[idx] ?? 'none';

            // Keep cards invisible/scaled down initially before animation runs
            card.style.transform = (card.style.transform !== 'none' ? card.style.transform : '') + ' scale(0)';

            card.innerHTML = htmlContent;

            this.container.appendChild(card);
            this.cards.push(card);

            if (this.enableHover) {
                card.addEventListener('mouseenter', () => this.pushSiblings(idx));
                card.addEventListener('mouseleave', () => this.resetSiblings());
            }
        });

        // Use Intersection Observer to trigger GSAP when element flows into view
        const observer = new IntersectionObserver((entries) => {
            if (entries[0].isIntersecting) {
                this.playAnimation();
                observer.disconnect();
            }
        }, { threshold: 0.2 });

        observer.observe(this.container);
    }

    playAnimation() {
        gsap.fromTo(
            this.cards,
            { scale: 0 },
            {
                scale: 1,
                stagger: this.animationStagger,
                ease: this.easeType,
                delay: this.animationDelay,
                onStart: () => {
                    // Let GSAP take over final scale logic
                    this.cards.forEach((c, i) => {
                        c.style.transform = this.transformStyles[i] ?? 'none';
                    });
                }
            }
        );
    }

    getNoRotationTransform(transformStr) {
        const hasRotate = /rotate\([\s\S]*?\)/.test(transformStr);
        if (hasRotate) {
            return transformStr.replace(/rotate\([\s\S]*?\)/, 'rotate(0deg)');
        } else if (transformStr === 'none') {
            return 'rotate(0deg)';
        } else {
            return `${transformStr} rotate(0deg)`;
        }
    }

    getPushedTransform(baseTransform, offsetX) {
        const translateRegex = /translate\(([-0-9.]+)px\)/;
        const match = baseTransform.match(translateRegex);
        if (match) {
            const currentX = parseFloat(match[1]);
            const newX = currentX + offsetX;
            return baseTransform.replace(translateRegex, `translate(${newX}px)`);
        } else {
            return baseTransform === 'none' ? `translate(${offsetX}px)` : `${baseTransform} translate(${offsetX}px)`;
        }
    }

    pushSiblings(hoveredIdx) {
        if (!this.enableHover) return;

        this.cards.forEach((target, i) => {
            gsap.killTweensOf(target);
            const baseTransform = this.transformStyles[i] || 'none';

            if (i === hoveredIdx) {
                const noRotationTransform = this.getNoRotationTransform(baseTransform);
                gsap.to(target, {
                    transform: noRotationTransform,
                    duration: 0.4,
                    ease: 'back.out(1.4)',
                    overwrite: 'auto',
                    zIndex: 10 // Bring forward
                });
            } else {
                const offsetX = i < hoveredIdx ? -this.pushAmount : this.pushAmount;
                const pushedTransform = this.getPushedTransform(baseTransform, offsetX);

                const distance = Math.abs(hoveredIdx - i);
                const delay = distance * 0.05;

                gsap.to(target, {
                    transform: pushedTransform,
                    duration: 0.4,
                    ease: 'back.out(1.4)',
                    delay,
                    overwrite: 'auto',
                    zIndex: 1 // Push back
                });
            }
        });
    }

    resetSiblings() {
        if (!this.enableHover) return;

        this.cards.forEach((target, i) => {
            gsap.killTweensOf(target);
            const baseTransform = this.transformStyles[i] || 'none';
            target.style.zIndex = 1;

            gsap.to(target, {
                transform: baseTransform,
                duration: 0.4,
                ease: 'back.out(1.4)',
                overwrite: 'auto'
            });
        });
    }
}
