import { APP_VERSION } from './app_version.js';
import fs from 'fs'

import shell from 'shelljs'


function insert_version_to_txt() {
  const read_json = fs.readFileSync('version_build.json', 'utf8');
  const version_json = JSON.parse(read_json);
  
  shell.echo(version_json);
  
  const tagPostfix = postfixArg ? `-${postfixArg}` : ''; // пример: x.y.z-dev, если нет аргумента - x.y.z
  shell.echo(`The tagPostfix is: ${tagPostfix || 'none'}`);
  
  // ПОИСК ПОСЛЕДНЕГО ТЕГА ДЛЯ ТЕКУЩЕГО РЕЛИЗА
  const releaseNum = version_json.version; // читаем содержимое файла чтобы получить версию (x.y) текущего релиза
  shell.echo(`The releaseNum is: ${releaseNum || 'none'}`);
  
  const tagsTemplateToSearch = `${releaseNum}.*${tagPostfix}`; // 'x.y.*-postfix' шаблон для поиска предыдущих тегов для текущего релиза
  const releasedTags = shell
    .exec(`git tag -l ${tagsTemplateToSearch} --sort=-v:refname`)
    .split('\n')
    .filter(Boolean);
  
  const lastReleaseTag = releasedTags.length > 0 ? releasedTags[0] : '';
  shell.echo(`The last tag for ${releaseNum}: ${lastReleaseTag || '-'}`);
  
  const active_brach = shell.exec(`git branch --show-current`)
  shell.echo(`Current branch for ${releaseNum}: ${active_brach || '-'}`);
  
  console.log(active_brach != "developer\n");
  
  const version_str = `${releaseNum || '-'}.${version_json.build}${active_brach != "developer\n" ? ('-' + active_brach) : ''}`
  
  // shell.cd('./build/')
  shell.exec(`echo "${version_str}" > ./build/version.txt`);
}

if (!shell.which('git')) {
  shell.echo('This script requires git');
  shell.exit(1);
}

const postfixArg = process.argv[2]; // переданные аргументы во время запуска скрипта начинаются со второго индекса, ссылка: https://nodejs.org/docs/latest/api/process.html#process_process_argv

insert_version_to_txt();

// shell.mv('build_arch.cpio', `build_arch_${lastReleaseTag}_b${version_json.build}.cpio`)

// ПОЛУЧЕНИЕ НОВОЙ ВЕРСИИ

// let patchVersion = 1;
// if (lastReleaseTag) {
//   // если для данного релиза уже были теги, получить версию последнего патча и увеличить
//   const lastReleaseVersion = lastReleaseTag.split('-')[0]; // получаем 'x.y.z' из 'x.y.z-postfix'
//   patchVersion = +lastReleaseVersion.split('.').pop() + 1; // получаем патч версию z из x.y.z и увеличиваем на 1
// }

// const newVersionTag = `${releaseNum}.${patchVersion}${tagPostfix}`;

// shell.echo(`New version tag: ${newVersionTag}`);

// // СОХРАНЯЕМ ВЕРСИЮ СБОРКИ В app-version.js
// shell.sed('-i', '{VERSION}', newVersionTag, 'app_version.js');

// // КОММИТИМ НОВЫЙ ТЕГ
// shell.exec(`git tag ${newVersionTag}`);