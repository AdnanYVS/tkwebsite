import React from 'react';

const PrivacyPolicy = () => {
  return (
    <div className="container mx-auto px-6 py-12 max-w-4xl">
      <h1 className="text-4xl font-bold mb-8">Gizlilik Politikası</h1>

      <section className="mb-6">
        <h2 className="text-2xl font-semibold mb-3">1. Topladığımız Bilgiler</h2>
        <p>
          Web sitemizi ziyaret ettiğinizde, sizinle ilgili bazı bilgileri topluyoruz. Bunlar kişisel bilgileriniz, IP adresiniz, cihaz bilgileri ve çerezler olabilir.
        </p>
      </section>

      <section className="mb-6">
        <h2 className="text-2xl font-semibold mb-3">2. Bilgilerin Kullanımı</h2>
        <p>
          Toplanan bilgileri, hizmetlerimizi geliştirmek, kullanıcı deneyimini artırmak ve yasal gereklilikleri yerine getirmek için kullanıyoruz.
        </p>
      </section>

      <section className="mb-6">
        <h2 className="text-2xl font-semibold mb-3">3. Bilgilerin Paylaşımı</h2>
        <p>
          Kişisel bilgileriniz, üçüncü taraflarla paylaşılmaz. Ancak yasal zorunluluklar ve hizmet sağlayıcılarımız ile paylaşım yapılabilir.
        </p>
      </section>

      <section className="mb-6">
        <h2 className="text-2xl font-semibold mb-3">4. Çerezler (Cookies)</h2>
        <p>
          Web sitemiz çerezler kullanabilir. Çerezler, siteyi kullanımınızı analiz etmek ve tercihlerinizi hatırlamak için kullanılır.
        </p>
      </section>

      <section className="mb-6">
        <h2 className="text-2xl font-semibold mb-3">5. Haklarınız</h2>
        <p>
          Kişisel verilerinize erişme, düzeltme ve silme haklarınız bulunmaktadır. Bu haklarınızı kullanmak için bizimle iletişime geçebilirsiniz.
        </p>
      </section>

      <section className="mb-6">
        <h2 className="text-2xl font-semibold mb-3">6. İletişim</h2>
        <p>
          Gizlilik politikamızla ilgili sorularınız için bizimle iletişime geçebilirsiniz: <a href="mailto:info@tarimkafasi.com" className="text-primary underline">info@tarimkafasi.com</a>
        </p>
      </section>
    </div>
  );
};

export default PrivacyPolicy;
