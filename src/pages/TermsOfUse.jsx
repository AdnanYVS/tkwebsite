import React from 'react';

const TermsOfUse = () => {
  return (
    <div className="container mx-auto px-6 py-12 max-w-4xl">
      <h1 className="text-4xl font-bold mb-8">Kullanım Şartları</h1>

      <section className="mb-6">
        <h2 className="text-2xl font-semibold mb-3">1. Genel Hükümler</h2>
        <p>
          Bu web sitesini kullanarak, aşağıda belirtilen şartları kabul etmiş sayılırsınız. Lütfen kullanım şartlarını dikkatlice okuyunuz.
        </p>
      </section>

      <section className="mb-6">
        <h2 className="text-2xl font-semibold mb-3">2. Hizmetlerin Kullanımı</h2>
        <p>
          Sitemizde sunulan içerikler yalnızca bilgilendirme amaçlıdır. Hizmetleri kullanırken yürürlükteki yasalara uygun davranmanız gerekmektedir.
        </p>
      </section>

      <section className="mb-6">
        <h2 className="text-2xl font-semibold mb-3">3. Kullanıcı Sorumlulukları</h2>
        <p>
          Kullanıcılar, siteyi kötü amaçlı kullanmamalı, zarar vermemeli ve diğer kullanıcıların haklarını ihlal etmemelidir.
        </p>
      </section>

      <section className="mb-6">
        <h2 className="text-2xl font-semibold mb-3">4. Telif Hakları</h2>
        <p>
          Sitedeki tüm içeriklerin telif hakları saklıdır. İzinsiz kullanımı yasaktır.
        </p>
      </section>

      <section className="mb-6">
        <h2 className="text-2xl font-semibold mb-3">5. Sorumluluk Reddi</h2>
        <p>
          Sitemiz içerikleri doğru ve güncel olmaya çalışsa da hata veya eksikliklerden dolayı sorumluluk kabul etmez.
        </p>
      </section>

      <section className="mb-6">
        <h2 className="text-2xl font-semibold mb-3">6. Değişiklikler</h2>
        <p>
          Kullanım şartları önceden haber vermeksizin değiştirilebilir. Güncel şartlar site üzerinde yayınlanır.
        </p>
      </section>

      <section className="mb-6">
        <h2 className="text-2xl font-semibold mb-3">7. İletişim</h2>
        <p>
          Kullanım şartları ile ilgili sorularınız için bizimle iletişime geçebilirsiniz: <a href="mailto:info@tarimkafasi.com" className="text-primary underline">info@tarimkafasi.com</a>
        </p>
      </section>
    </div>
  );
};

export default TermsOfUse;
