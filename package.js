Package.describe({
    summary: "Simple chat windows. The star point to make your own chat",
    version: "0.2.3",
    name: "cesarve:simple-chat",
    git: "https://github.com/cesarve77/simple-chat"
});

Package.onUse(function (api) {
    api.use([
        'templating',
        'momentjs:moment@2.11.1',
        'check',
        'ecmascript',
        'jquery',
        'tracker',
        'reactive-var'
    ])
    api.use('matb33:collection-hooks@0.8.0', ['server', 'client'], {weak: true})

    api.versionsFrom('1.2.1');
    api.addFiles(['config.js','collections.js','methods.js'], ['client','server']);

    api.addFiles(['publications.js'], ['server']);
    api.addFiles(['methods_server.js'], ['server']);
    api.addFiles(['window.html', 'window.js', 'window.css','visivility.js'], ['client']);
    api.addFiles(['spinner.html','spinner.css'], ['client']);

    api.addAssets(['assets/bell.mp3'],'client')

    api.addAssets(['assets/fonts/chat.eot','assets/fonts/chat.woff','assets/fonts/chat.svg','assets/fonts/chat.ttf'],'client')
    api.export('SimpleChat')
});

