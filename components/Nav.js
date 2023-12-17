import html from "html-literal";

export default (links) => html`
<div class="dropdown">
    <button class="dropdown-button">Menu</button>
    <div class="dropdown-content">
        <a href="index.html">Home</a>
        <a href="application.html">Application</a>
        <a href="about.html">About</a>
        <a href="contact.html">Contact</a>
    </div>
</div>
`;