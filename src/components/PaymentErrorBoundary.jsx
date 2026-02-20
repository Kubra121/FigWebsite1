import React from 'react';

class PaymentErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, info) {
    console.error('PaymentPage error:', error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <h2>Ödeme sayfasında bir hata oluştu. Lütfen sayfayı yenileyin.</h2>
      );
    }
    return this.props.children;
  }
}

export default PaymentErrorBoundary;
