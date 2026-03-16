export function easterEgg(){
// ─── Easter Egg ───────────────────────────────────────────────────────────────
    const brand = `
      ██████╗ ███████╗ ██████╗   █████╗  ██╗ ████████╗  ██╗  ██╗███████╗ █████╗ ██████╗ ████████╗
    ██ ╔════╝ ██╔════╝ ██╔══██╗ ██╔══██╗ ██║ ╚══██╔══╝  ██║  ██║██╔════╝██╔══██╗██╔══██╗╚══██╔══╝
    ██ ║████╗ █████╗   ██████╔╝ ███████║ ██║    ██║     ███████║█████╗  ███████║██████╔╝   ██║   
    ██ ╚══██║ ██╔══╝   ██╔══██╗ ██╔══██║ ██╚══╗ ██║     ██╔══██║██╔══╝  ██╔══██║██╔══██╗   ██║   
    ╔███████║ ███████╗ ██║  ██║ ██║  ██║ █████║ ██║     ██║  ██║███████╗██║  ██║██║  ██║   ██║   
    ╚═══════╝ ╚══════╝ ╚═╝  ╚═╝ ╚═╝  ╚═╝ ╚════╝ ╚═╝     ╚═╝  ╚═╝╚══════╝╚═╝  ╚═╝╚═╝  ╚═╝   ╚═╝   
    `;
    // Define your colors
    const blockStyle = 'color: #ffffff; font-family: monospace; line-height: 1.2;';
    const lineStyle = 'color: #00ffcc; font-family: monospace; line-height: 1.2;';

    // Split the string into segments of "blocks" vs "lines/others"
    const segments = brand.match(/(█+)|([^█]+)/g);
    const styles = [];

    const coloredBrand = segments.map(seg => {
        // If the segment contains █, use blockStyle, otherwise lineStyle
        styles.push(seg.includes('█') ? blockStyle : lineStyle);
        return `%c${seg}`;
    }).join('');

    console.log(coloredBrand, ...styles);

    const socials = `
    ╔═ Hello Developer :) ══╗
    ║ If you found this page send me a message at my email and I'll respond!
    ╚═══════════════════════╝

    ╔═ Socials ═════════════╗
    ║ Mail           ⇒ emailme@geraltheart.com
    ║ GitHub         ⇒ https://github.com/GHeart01
    ║ LinkedIn       ⇒ https://www.linkedin.com/in/geraltheart001
    ╚═══════════════════════╝

    ╔═ Debug ═══════════════╗
    ║ You can access the debug mode by pressing 'h'
    ╚═══════════════════════╝

    ╔═ Source code ═════════╗
    ║ The code for this portfolio is available on GitHub 
    ║ https://github.com/GHeart01/Portfolio2026
    ╚═══════════════════════╝
    `;

    const boxStyle = 'color: #00ffcc; font-family: monospace; line-height: 1.2; font-weight: bold;';
    const textStyle = 'color: #ffffff; font-family: monospace; line-height: 1.2;';

    // Regex to catch: ╔ ═ ║ ╚ ╝ ╗ ══ ═╝ 
    const boxCharsRegex = /([╔═║╚╝╗]+)|([^╔═║╚╝╗]+)/g;

    const socialSegments = socials.match(boxCharsRegex);
    const socialStyles = [];

    const coloredSocials = socialSegments.map(seg => {
        // If the segment contains box-drawing characters, use boxStyle
        const isBox = /[╔═║╚╝╗]/.test(seg);
        socialStyles.push(isBox ? boxStyle : textStyle);
        return `%c${seg}`;
    }).join('');

    console.log(coloredSocials, ...socialStyles);
}