
// Display a worksheet item which corresponds to a table where each row is a bundle.
var TableItem = React.createClass({
    mixins: [CheckboxMixin],

    getInitialState: function() {
      return { };
    },

    capture_keys: function() {
        // Open worksheet in new window/tab
        Mousetrap.bind(['enter'], function(e) {
            window.open(this.refs['row' + this.props.subFocusIndex].props.url, '_blank');
        }.bind(this), 'keydown');

        // Paste uuid of focused bundle into console
        Mousetrap.bind(['u'], function(e) {
            var uuid = this.refs['row' + this.props.subFocusIndex].props.uuid;
            $('#command_line').terminal().insert(uuid + ' ');
            //this.props.focusActionBar();
        }.bind(this), 'keydown');

        // Paste args of focused bundle into console
        Mousetrap.bind(['a'], function(e) {
            var bundleInfo = this.refs['row' + this.props.subFocusIndex].props.bundleInfo;
            if (bundleInfo.args != null) {
                $('#command_line').terminal().insert(bundleInfo.args);
                this.props.focusActionBar();
            }
        }.bind(this), 'keydown');
    },

    updateRowIndex: function(rowIndex) {
        this.props.setFocus(this.props.focusIndex, rowIndex);
    },

    shouldComponentUpdate: function(nextProps, nextState) {
      return worksheetItemPropsChanged(this.props, nextProps);
    },

    render: function() {
        if (this.props.active && this.props.focused)
          this.capture_keys();

        var self = this;
        var tableClassName = (this.props.focused ? 'table focused' : 'table');
        var item = this.props.item;
        var canEdit = this.props.canEdit;
        var bundle_info = item.bundle_info;
        var header_items = item.interpreted[0];
        var column_classes = header_items.map(function(item, index) {
            return 'table-column-' + encodeURIComponent(item).replace("%", "_").replace(/[^-_A-Za-z0-9]/g, "_");
        });
        var header_html = header_items.map(function(item, index) {
            return <th key={index} className={column_classes[index]}>{item}</th>;
        });
        var row_items = item.interpreted[1];  // Array of {header: value, ...} objects
        var column_with_hyperlinks = [];
        Object.keys(row_items[0]).forEach(function(x) {
            if (row_items[0][x] && row_items[0][x]['path'])
                column_with_hyperlinks.push(x);
        });
        var body_rows_html = row_items.map(function(row_item, row_index) {
            var row_ref = 'row' + row_index;
            var row_focused = self.props.focused && (row_index == self.props.subFocusIndex);
            var url = '/bundles/' + bundle_info[row_index].uuid;
            return <TableRow
                     key={row_index}
                     ref={row_ref}
                     item={row_item}
                     rowIndex={row_index}
                     focused={row_focused}
                     focusIndex={self.props.focusIndex}
                     url={url}
                     bundleInfo={bundle_info[row_index]}
                     uuid={bundle_info[row_index].uuid}
                     headerItems={header_items}
                     columnClasses={column_classes}
                     canEdit={canEdit}
                     updateRowIndex={self.updateRowIndex}
                     columnWithHyperlinks={column_with_hyperlinks}
                     handleContextMenu={self.props.handleContextMenu}
                   />;
        });
        return (
            <div className="ws-item">
                <div className="type-table table-responsive">
                    <table className={tableClassName}>
                        <thead>
                            <tr>
                                {header_html}
                                <th className='table-column-_dropdown'></th>
                            </tr>
                        </thead>
                        <tbody>
                            {body_rows_html}
                        </tbody>
                    </table>
                </div>
            </div>
        );
    }
});

////////////////////////////////////////////////////////////

var TableRow = React.createClass({
    getInitialState: function() {
        return { };
    },

    handleClick: function() {
        this.props.updateRowIndex(this.props.rowIndex);
    },

    handleOptionButtonClick(e) {
        e.nativeEvent.stopImmediatePropagation();
        this.boundHandleContextMenu(e);
    },

    boundHandleContextMenu(e) {
        this.props.handleContextMenu.bind(
            null, this.props.bundleInfo.uuid,
            this.props.focusIndex,
            this.props.rowIndex,
            this.props.bundleInfo.bundle_type === 'run'
        )(e);
    },

    render: function() {
        var focusedClass = this.props.focused ? 'focused' : '';
        var row_items = this.props.item;
        var column_classes = this.props.columnClasses;
        var base_url = this.props.url;
        var uuid = this.props.uuid;
        var column_with_hyperlinks = this.props.columnWithHyperlinks;
        var row_cells = this.props.headerItems.map(function(header_key, col) {
            var row_content = row_items[header_key];

            // See if there's a link
            var url;
            if (col == 0) {
              url = base_url;
            } else if (column_with_hyperlinks.indexOf(header_key) != -1) {
              url = '/rest/bundles/' + uuid + '/contents/blob' + row_content['path'];
              if ('text' in row_content) {
                row_content = row_content['text'];
              } else {
                // In case text doesn't exist, content will default to basename of the path
                // indexing 1 here since the path always starts with '/'
                row_content = row_content['path'].split('/')[1];
              }
            }
            if (url)
              row_content = <a href={url} className="bundle-link" target="_blank">{row_content}</a>;
            else
              row_content = row_content + '';

            return (
              <td key={col} className={column_classes[col]}>
                {row_content}
              </td>
            );
        });

        return (
            <tr className={focusedClass} onClick={this.handleClick} onContextMenu={this.boundHandleContextMenu}>
                {row_cells}
                <td className="table-column-_dropdown">
                    <div onClick={this.handleOptionButtonClick}>
                        <span className="caret"></span>
                    </div>
                </td>
            </tr>
        );
    }
});
