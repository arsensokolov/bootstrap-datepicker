Description
====================

Add datepicker picker to field or to any other element.
* can be used as a component
* formats: dd, d, mm, m, yyyy, yy
* separators: -, /, .
* multilanguage support: English, Abkhaz, Afrikaans, Albanian, Amharic, Arabic, Armenian, Azeri, Belarusian, Bengali, Bosnian, Bulgarian, Burmese, Catalan, Chechen, Cherokee, Chinese, Cree, Croatian, Czech, Danish, Dutch, Esperanto, Estonian, Faroese, Finnish, French, Galician, Georgian, German, Greek, Haitian Creole, Hawaiian, Hebrew, Hindi, Hungarian, Icelandic, Ido, Indonesian, Interlingua, Irish, Italian, Japanese, Jèrriais, Karelian, Kazakh, Khmer, Korean, Kyrgyz, Lao, Latin, Latvian, Lezgi, Lithuanian, Livonian, Lojban, Luxembourgish, Macedonian, Malay, Malayalam, Maltese, Mongolian, Navajo, Norwegian (Bokmål), Norwegian (Nynorsk), Novial, Ojibwe, Old English, Old Prussian, Ossetian (Digor dialect), Ossetian (Iron dialect), Persian, Polish, Portuguese, Romanian, Russian, Scots, Sinhalese, Slovak, Slovene (Slovenian), Serbian, Spanish, Swedish, Tagalog, Tajik, Tamil, Tatar, Telugu, Thai, Tok Pisin, Turkish, Turkmen, Ukrainian, Urdu, Uzbek, Vietnamese, Volapük, Walloon, Welsh, West Frisian, Yiddish and Yup'ik only.

## Using bootstrap-datepicker.js


Call the datepicker via javascript:

    $('.datepicker').datepicker()
    
### Options
<table>
    <tr>
        <th>Name</th>
        <th>type</th>
        <th>default</th>
        <th>description</th>
    </tr>
    <tr>
        <td>format</td>
        <td>string</td>
        <td nowrap>'mm/dd/yyyy'</td>
        <td>the date format, combination of d, dd, m, mm, yy, yyy.</td>
    </tr>
    <tr>
        <td>weekStart</td>
        <td>integer</td>
        <td>0</td>
        <td>day of the week start. 0 for Sunday - 6 for Saturday</td>
    </tr>
    <tr>
        <td>viewMode</td>
        <td nowrap>string | integer</td>
        <td>0 = 'days'</td>
        <td>set the start view mode. Accepts: 'days', 'months', 'years', 0 for days, 1 for months and 2 for years</td>
    </tr>
    <tr>
        <td>minViewMode</td>
        <td nowrap>string | integer</td>
        <td>0 = 'days'</td>
        <td>set a limit for view mode. Accepts: 'days', 'months', 'years', 0 for days, 1 for months and 2 for years</td>
    </tr>
    <tr>
        <td>language</td>
        <td nowrap>string</td>
        <td>'en'</td>
        <td>set the language calendar mode. Now support only: 'en' (Englich), 'ru' (Russian)</td>
    </tr>
</table>

### Markup
Format a component.

    <div class="input-append date" id="dp3" data-date="12-02-2012" data-date-format="dd-mm-yyyy">
        <input class="span2" size="16" type="text" value="12-02-2012">
        <span class="add-on"><i class="icon-th"></i></span>
    </div>

### Methods
__.datapicker(options);__
Initializes an datepicker.

__.datapicker('show');__
Show the datepicker.

__.datapicker('hide');__
Hide the datepicker.

__.datapicker('place');__
Updates the date picker's position relative to the element

__.datapicker('setValue', value);__
Set a new value for the datepicker. It cand be a string in the specified format or a Date object.

### Events
Datepicker class exposes a few events for manipulating the dates.

<table width="100%">
    <tr>
        <th>Event</th>
        <th>Description</th>
    </tr>
    <tr>
        <td>show</td>
        <td>This event fires immediately when the date picker is displayed.</td>
    </tr>
    <tr>
        <td>hide</td>
        <td>This event is fired immediately when the date picker is hidden.</td>
    </tr>
    <tr>
        <td>changeDate</td>
        <td>This event is fired when the date is changed.</td>
    </tr>
</table>

    $('#dp5').datapicker()
        .on('changeDate', function(e) {
            if (e.date.valueOf() <> startDate.valueOf()) {
                ....
            }
    });


# Language Translation Complete
<table width="100%">
    <tr>
        <th>Language</th>
        <th>Complete</th>
    </tr>
    <tr>
        <td>English</td>
        <td>100%</td>
    </tr>
    <tr>
        <td>Abkhaz</td>
        <td>100%</td>
    </tr>
    <tr>
        <td>Afrikaans</td>
        <td>100%</td>
    </tr>
    <tr>
        <td>Albanian</td>
        <td>16%</td>
    </tr>
    <tr>
        <td>Amharic</td>
        <td>42%</td>
    </tr>
    <tr>
        <td>Arabic</td>
        <td>42%</td>
    </tr>
    <tr>
        <td>Armenian</td>
        <td>42%</td>
    </tr>
    <tr>
        <td>Azeri</td>
        <td>16%</td>
    </tr>
    <tr>
        <td>Belarusian</td>
        <td>100%</td>
    </tr>
    <tr>
        <td>Bengali</td>
        <td>42%</td>
    </tr>
    <tr>
        <td>Bosnian</td>
        <td>100%</td>
    </tr>
    <tr>
        <td>Bulgarian</td>
        <td>100%</td>
    </tr>
    <tr>
        <td>Burmese</td>
        <td>42%</td>
    </tr>
    <tr>
        <td>Catalan</td>
        <td>16%</td>
    </tr>
    <tr>
        <td>Chechen</td>
        <td>100%</td>
    </tr>
    <tr>
        <td>Cherokee</td>
        <td>42%</td>
    </tr>
    <tr>
        <td>Chinese</td>
        <td>83%</td>
    </tr>
    <tr>
        <td>Cree</td>
        <td>16%</td>
    </tr>
    <tr>
        <td>Croatian</td>
        <td>100%</td>
    </tr>
    <tr>
        <td>Czech</td>
        <td>100%</td>
    </tr>
    <tr>
        <td>Danish</td>
        <td>100%</td>
    </tr>
    <tr>
        <td>Dutch</td>
        <td>100%</td>
    </tr>
    <tr>
        <td>Esperanto</td>
        <td>100%</td>
    </tr>
    <tr>
        <td>Estonian</td>
        <td>100%</td>
    </tr>
    <tr>
        <td>Faroese</td>
        <td>100%</td>
    </tr>
    <tr>
        <td>Finnish</td>
        <td>100%</td>
    </tr>
    <tr>
        <td>French</td>
        <td>100%</td>
    </tr>
    <tr>
        <td>Galician</td>
        <td>100%</td>
    </tr>
    <tr>
        <td>Georgian</td>
        <td>42%</td>
    </tr>
    <tr>
        <td>German</td>
        <td>100%</td>
    </tr>
    <tr>
        <td>Greek</td>
        <td>100%</td>
    </tr>
    <tr>
        <td>Haitian Creole</td>
        <td>100%</td>
    </tr>
    <tr>
        <td>Hawaiian</td>
        <td>67%</td>
    </tr>
    <tr>
        <td>Hebrew</td>
        <td>42%</td>
    </tr>
    <tr>
        <td>Hindi</td>
        <td>42%</td>
    </tr>
    <tr>
        <td>Hungarian</td>
        <td>100%</td>
    </tr>
    <tr>
        <td>Icelandic</td>
        <td>100%</td>
    </tr>
    <tr>
        <td>Ido</td>
        <td>16%</td>
    </tr>
    <tr>
        <td>Indonesian</td>
        <td>83%</td>
    </tr>
    <tr>
        <td>Interlingua</td>
        <td>50%</td>
    </tr>
    <tr>
        <td>Irish</td>
        <td>100%</td>
    </tr>
    <tr>
        <td>Italian</td>
        <td>100%</td>
    </tr>
    <tr>
        <td>Japanese</td>
        <td>83%</td>
    </tr>
    <tr>
        <td>Jèrriais</td>
        <td>50%</td>
    </tr>
    <tr>
        <td>Karelian</td>
        <td>33%</td>
    </tr>
    <tr>
        <td>Kazakh</td>
        <td>33%</td>
    </tr>
    <tr>
        <td>Khmer</td>
        <td>67%</td>
    </tr>
    <tr>
        <td>Korean</td>
        <td>83%</td>
    </tr>
    <tr>
        <td>Kyrgyz</td>
        <td>33%</td>
    </tr>
    <tr>
        <td>Lao</td>
        <td>42%</td>
    </tr>
    <tr>
        <td>Latin</td>
        <td>100%</td>
    </tr>
    <tr>
        <td>Latvian</td>
        <td>100%</td>
    </tr>
    <tr>
        <td>Lezgi</td>
        <td>100%</td>
    </tr>
    <tr>
        <td>Lithuanian</td>
        <td>50%</td>
    </tr>
    <tr>
        <td>Livonian</td>
        <td>50%</td>
    </tr>
    <tr>
        <td>Lojban</td>
        <td>50%</td>
    </tr>
    <tr>
        <td>Luxembourgish</td>
        <td>100%</td>
    </tr>
    <tr>
        <td>Macedonian</td>
        <td>100%</td>
    </tr>
    <tr>
        <td>Malay</td>
        <td>100%</td>
    </tr>
    <tr>
        <td>Malayalam</td>
        <td>42%</td>
    </tr>
    <tr>
        <td>Maltese</td>
        <td>33%</td>
    </tr>
    <tr>
        <td>Mongolian</td>
        <td>50%</td>
    </tr>
    <tr>
        <td>Navajo</td>
        <td>42%</td>
    </tr>
    <tr>
        <td>Norwegian (Bokmål)</td>
        <td>100%</td>
    </tr>
    <tr>
        <td>Norwegian (Nynorsk)</td>
        <td>100%</td>
    </tr>
    <tr>
        <td>Novial</td>
        <td>50%</td>
    </tr>
    <tr>
        <td>Ojibwe</td>
        <td>42%</td>
    </tr>
    <tr>
        <td>Old English</td>
        <td>75%</td>
    </tr>
    <tr>
        <td>Old Prussian</td>
        <td>100%</td>
    </tr>
    <tr>
        <td>Ossetian (Digor dialect)</td>
        <td>50%</td>
    </tr>
    <tr>
        <td>Ossetian (Iron dialect)</td>
        <td>17%</td>
    </tr>
    <tr>
        <td>Persian</td>
        <td>17%</td>
    </tr>
    <tr>
        <td>Polish</td>
        <td>100%</td>
    </tr>
    <tr>
        <td>Portuguese</td>
        <td>83%</td>
    </tr>
    <tr>
        <td>Romanian</td>
        <td>100%</td>
    </tr>
    <tr>
        <td>Russian</td>
        <td>100%</td>
    </tr>
    <tr>
        <td>Scots</td>
        <td>50%</td>
    </tr>
    <tr>
        <td>Sinhalese</td>
        <td>42%</td>
    </tr>
    <tr>
        <td>Slovak</td>
        <td>100%</td>
    </tr>
    <tr>
        <td>Slovene (Slovenian)</td>
        <td>75%</td>
    </tr>
    <tr>
        <td>Serbian</td>
        <td>100%</td>
    </tr>
    <tr>
        <td>Spanish</td>
        <td>100%</td>
    </tr>
    <tr>
        <td>Swedish</td>
        <td>100%</td>
    </tr>
    <tr>
        <td>Tagalog</td>
        <td>100%</td>
    </tr>
    <tr>
        <td>Tajik</td>
        <td>50%</td>
    </tr>
    <tr>
        <td>Tamil</td>
        <td>42%</td>
    </tr>
    <tr>
        <td>Tatar</td>
        <td>100%</td>
    </tr>
    <tr>
        <td>Telugu</td>
        <td>42%</td>
    </tr>
    <tr>
        <td>Thai</td>
        <td>42%</td>
    </tr>
    <tr>
        <td>Tok Pisin</td>
        <td>50%</td>
    </tr>
    <tr>
        <td>Turkish</td>
        <td>67%</td>
    </tr>
    <tr>
        <td>Turkmen</td>
        <td>50%</td>
    </tr>
    <tr>
        <td>Ukrainian</td>
        <td>100%</td>
    </tr>
    <tr>
        <td>Urdu</td>
        <td>17%</td>
    </tr>
    <tr>
        <td>Uzbek</td>
        <td>50%</td>
    </tr>
    <tr>
        <td>Vietnamese</td>
        <td>42%</td>
    </tr>
    <tr>
        <td>Volapük</td>
        <td>50%</td>
    </tr>
    <tr>
        <td>Walloon</td>
        <td>100%</td>
    </tr>
    <tr>
        <td>Welsh</td>
        <td>100%</td>
    </tr>
    <tr>
        <td>West Frisian</td>
        <td>42%</td>
    </tr>
    <tr>
        <td>Yiddish</td>
        <td>42%</td>
    </tr>
    <tr>
        <td>Yup'ik</td>
        <td>75%</td>
    </tr>
</table>