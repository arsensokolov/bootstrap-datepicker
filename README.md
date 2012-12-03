Description
====================

Add datepicker picker to field or to any other element.
* can be used as a component
* formats: dd, d, mm, m, yyyy, yy
* separators: -, /, .
* multilanguage support (English and Russian only)

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

