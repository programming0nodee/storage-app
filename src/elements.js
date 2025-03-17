var manifest = {
    name: 'Storage app',
    short_name: 'Storage app',
    description: 'Storage app',
    start_url: '/',
    display: 'standalone',
    orientation: 'portrait',
    background_color: '#ffffff',
    theme_color: '#ffffff',
    // Favicon
    icons: [{
      src: 'icon/favicon.ico',
      size: '16x16'
    },{
      src: 'icon/favicon32.png',
      size: '32x32'
    },{
      src: 'icon/favicon64.png',
      size: '64x64'
    },{
      src: 'icon/favicon144.png',
      size: '144x144'
    },
    // Manifest
    {
      src: 'icon/manifest48.png',
      size: '192x192'
    },{
      src: 'icon/manifest72.png',
      size: '72x72'
    },{
      src: 'icon/manifest96.png',
      size: '96x96'
    },{
      src: 'icon/manifest144.png',
      size: '144x144'
    },{
      src: 'icon/manifest192.png',
      size: '192x192'
    },{
      src: 'icon/manifest512.png',
      size: '512x512'
    },{
      src: 'icon/manifest1024.png',
      size: '1024x1024'
    },{
      src: 'icon/manifest192_maskable.png',
      size: '192x192'
    },{
      src: 'icon/manifest192_monochrome.png',
      size: '192x192'
    },{
      src: 'icon/manifest512_maskable.png',
      size: '512x512'
    },{
      src: 'icon/manifest512_monochrome.png',
      size: '512x512'
    },{
      src: 'icon/manifest1024_maskable.png',
      size: '1024x1024'
    },{
      src: 'icon/manifest1024_monochrome.png',
      size: '1024x1024'
    },
    // Apple
    {
      src: 'icon/apple120.png',
      size: '120x120'
    },{
      src: 'icon/apple152.png',
      size: '152x152'
    },{
      src: 'icon/apple180.png',
      size: '180x180'
    },{
      src: 'icon/apple167.png',
      size: '167x167'
    },{
      src: 'icon/apple180.png',
      size: '180x180'
    },{
      src: 'icon/apple1024.png',
      size: '1024x1024'
    },
    // SVG
    {
      src: 'icon/icon.svg',
      size: 'any'
    },{
      src: 'icon/maskable.svg',
      purpose: 'maskable',
      size: 'any'
    },{
      src: 'icon/monochrome.svg',
      purpose: 'monochrome',
      size: 'any'
    },
    // Other
    {
      src: 'icon/icon176.png',
      size: '176x176'
    },{
      src: 'icon/icon256.png',
      size: '256x256'
    },{
      src: 'icon/icon620.png',
      size: '620x620'
    },{
      src: 'icon/icon1240.png',
      size: '1240x1240'
    },{
      src: 'icon/icon2480.png',
      size: '2480x2480'
    }]
}


((app)=>{
  for(const [_, value] of Object.entries(app.elem)) {
    document.head.insertAdjacentHTML('beforeend', value);
  }

  for (const [_, value] of Object.entries(app.elements)) {
    document.head.insertAdjacentHTML('beforeend', value);
  }

  document.head.insertAdjacentHTML('beforeend', app.manifest.toString());
}).call(this, window.app);