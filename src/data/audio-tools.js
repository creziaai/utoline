// Audio tools. The client script lives in its own file (src/tools/) so it can be
// written as normal JavaScript, then is inlined into the page by the build.
const fs = require('fs');
const path = require('path');
const read = f => fs.readFileSync(path.join(__dirname, '..', 'tools', f), 'utf8');

module.exports = [
  {
    slug: 'microphone-test',
    name: 'Microphone Test',
    category: 'misc-tools',
    description: 'Test your microphone online with a live waveform and sound-level meter. Audio stays in your browser and is never recorded, stored or uploaded.',
    keywords: ['microphone test', 'mic test', 'test my microphone', 'check microphone online', 'audio input test', 'sound level meter'],
    related: ['qr-code-generator', 'random-number-generator', 'color-converter'],
    html: read('microphone-test.html'),
    script: read('microphone-test.client.js'),
    howTo: [
      'Select <strong>Start Test</strong> and allow microphone access when your browser asks.',
      'Speak or clap. The waveform should move and the level meter should respond.',
      'If nothing moves, check that the correct input is selected in your system or browser settings, then choose <strong>Test Again</strong>.',
      'Select <strong>Stop Test</strong> when you are done. The microphone is released immediately.'
    ],
    faq: [
      { q: 'Is my voice recorded or uploaded?', a: 'No. Audio is analysed live in your browser to draw the waveform and level. It is not recorded, saved, or sent to any server, and it is never played back through your speakers.' },
      { q: 'Why does my browser ask for permission?', a: 'Browsers require your explicit consent before any website can use the microphone. You can revoke it at any time in the site settings next to the address bar.' },
      { q: 'Why can’t I see my microphone name?', a: 'Some browsers only reveal the device name after permission is granted, and a few never do. In that case the tool shows a generic label.' },
      { q: 'The waveform is flat. What should I check?', a: 'Make sure the microphone is not muted, that the right input device is selected in your operating system, and that no other app has exclusive control of it. On a laptop, check the hardware mute key.' },
      { q: 'Does it work on mobile?', a: 'Yes, on current versions of Chrome, Safari, Firefox and Edge. The page must be loaded over HTTPS, which is required by browsers for microphone access.' }
    ]
  }
];
