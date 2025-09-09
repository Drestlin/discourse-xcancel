# name: discourse-xcancel
# about: Sostituisce i link x.com con xcancel.com nei post
# version: 0.1
# authors: Drest
# url: https://github.com/Drestlin/discourse-xcancel

enabled_site_setting :xcancel_enabled

after_initialize do
  # Intercetta la creazione e l'aggiornamento dei post
  on(:post_process_cooked) do |doc, post|
    # doc è un Nokogiri::HTML::DocumentFragment
    doc.css("a[href]").each do |a|
      href = a["href"]

      if href =~ /^https?:\/\/x\.com/i
        # 1️⃣ Se vuoi sostituire con xcancel.com:
        a["href"] = href.sub(/^https?:\/\/x\.com/i, "https://xcancel.com")

        # 2️⃣ Se vuoi rimuovere completamente il link ma lasciare il testo:
        #a.replace(a.text)
      end
    end

    # Aggiorna cooked HTML del post
    post.cooked = doc.to_html
  end
end