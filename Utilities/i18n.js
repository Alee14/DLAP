/**************************************************************************
 *
 *  DLAP Bot: A Discord bot that plays local audio tracks.
 *  (C) Copyright 2022
 *  Programmed by Andrew Lee
 *
 *  This program is free software: you can redistribute it and/or modify
 *  it under the terms of the GNU General Public License as published by
 *  the Free Software Foundation, either version 3 of the License, or
 *  (at your option) any later version.
 *
 *  This program is distributed in the hope that it will be useful,
 *  but WITHOUT ANY WARRANTY; without even the implied warranty of
 *  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 *  GNU General Public License for more details.
 *
 *  You should have received a copy of the GNU General Public License
 *  along with this program.  If not, see <https://www.gnu.org/licenses/>.
 *
 ***************************************************************************/
import i18next from 'i18next';
import fsBackend from 'i18next-fs-backend';
import { readFileSync } from 'node:fs';
const { locale } = JSON.parse(readFileSync('./config.json', 'utf-8'));

i18next.use(fsBackend).init({
  lng: locale, // if you're using a language detector, do not define the lng option
  debug: false,
  fallbackLng: 'en',
  backend: {
    loadPath: './Locales/{{lng}}/{{ns}}.json'
  }
});

export default {
  i18next,
  t(key, option) {
    return i18next.t(key, option);
  }
};
