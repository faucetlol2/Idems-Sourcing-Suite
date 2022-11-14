const { node_to_dtext, node_to_plain_text } = require('./node_to_dtext.js');

function set_clipboard (str) {
	const el = document.createElement('textarea');
	el.value = str;
	document.body.appendChild(el);
	el.select();
	document.execCommand('copy');
	document.body.removeChild(el);
}

function artist_commentary (artist_node, title_node, description_node) {
	const artist = artist_node.textContent;
	const artist_link = artist_node.href;
	const title = title_node !== null ? node_to_plain_text(title_node) : 'Untitled';
	const description = node_to_dtext(description_node);
	return commentary_from_text(artist, artist_link, title, description);
}

function commentary_from_text (artist, artist_link, title, description) {
	const full_title = (() => {
		const fixed_title = title.replace(/\[/gu, '(').replace(/\]/gu, ')').replace(/\n/, '');
		if (artist === null) {
			return fixed_title;
		} else if (artist_link === null || artist_link === undefined) {
			return `${fixed_title} - by ${artist}`;
		} else {
			return `${fixed_title} - by "${artist}":${artist_link}`;
		}
	})();

	const header = (() => {
		const lines = description.split('\n').length;
		return `h5.${full_title}`;
	})();

	return `${header}\n${description}\n`;
}

function commentary_button (description) {
	const button = document.createElement('button');
	button.textContent = 'Copy Description';
	button.id = 'iss_artist_commentary';
	// maybe deal with id's and classes?

	button.addEventListener('click', event => {
		event.preventDefault();
		set_clipboard(description);
	});

	return button;
}

module.exports = {
	set_clipboard: set_clipboard,
	artist_commentary: artist_commentary,
	commentary_button: commentary_button,
	commentary_from_text: commentary_from_text
};
