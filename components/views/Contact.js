import html from "html-literal";

export default () => html`  
<div id="p">
<p>Use this contact form to reach out for any questions or concerns</p>
    <div id="contact">
                <form action="https://formspree.io/f/xpzgvopk" method="POST">
            <label>
                Your email:
                <input type="email" name="email">
            </label>
            <label>
                Your message:
                <textarea name="message"></textarea>
            </label>
            <button type="submit">Send</button>
        </form>

    </div>
`